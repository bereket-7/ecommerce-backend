import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async initiate(dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentMethod === PaymentMethod.cash) {
      throw new BadRequestException(
        'Cash on delivery orders do not require online payment',
      );
    }

    if (order.paymentMethod !== dto.provider) {
      throw new BadRequestException(
        `Order payment method is ${order.paymentMethod}, not ${dto.provider}`,
      );
    }

    const redirectUrl = `https://pay.stub.kitchenedge.et/${dto.provider}?order=${order.orderNumber}&amount=${order.total}`;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      provider: dto.provider,
      amount: order.total,
      redirectUrl,
      message: 'Stub payment URL — integrate Telebirr/CBE SDK in production',
    };
  }

  async handleWebhook(
    provider: 'telebirr' | 'cbe',
    body: { orderNumber?: string; status?: string },
  ) {
    if (!body.orderNumber) {
      throw new BadRequestException('orderNumber is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { orderNumber: body.orderNumber },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const paid = body.status === 'success' || body.status === 'paid';

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paid ? PaymentStatus.paid : PaymentStatus.failed,
        status: paid ? OrderStatus.processing : order.status,
      },
    });

    return {
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
      provider,
    };
  }
}
