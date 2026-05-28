import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderAddressType,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { CouponsService } from '../coupons/coupons.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShippingService } from '../shipping/shipping.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shippingService: ShippingService,
    private readonly couponsService: CouponsService,
  ) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const productIds = dto.lines.map((l) => l.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const lineData: Prisma.OrderLineCreateWithoutOrderInput[] = [];

    for (const line of dto.lines) {
      const product = productMap.get(line.productId);
      if (!product) {
        throw new BadRequestException(`Product ${line.productId} not found`);
      }
      if (product.stock < line.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.title}`,
        );
      }

      const unitPrice = product.discountedPrice;
      const lineTotal = unitPrice * line.quantity;
      subtotal += lineTotal;

      lineData.push({
        product: { connect: { id: product.id } },
        title: product.title,
        quantity: line.quantity,
        unitPrice,
        lineTotal,
      });
    }

    let discountAmount = 0;
    if (dto.couponCode) {
      const couponResult = await this.couponsService.validate(
        dto.couponCode,
        subtotal,
      );
      if (!couponResult.valid) {
        throw new BadRequestException('Invalid coupon code');
      }
      discountAmount = couponResult.discountAmount;
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const shippingFee = this.shippingService.getShippingPrice(
      dto.shippingMethodId,
      subtotalAfterDiscount,
    );
    const total = subtotalAfterDiscount + shippingFee;

    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          status: OrderStatus.pending,
          paymentStatus:
            dto.paymentMethod === 'cash'
              ? PaymentStatus.pending
              : PaymentStatus.pending,
          paymentMethod: dto.paymentMethod,
          shippingMethodId: this.shippingService.toPrismaShippingMethodId(
            dto.shippingMethodId,
          ),
          subtotal,
          shippingFee,
          discountAmount,
          total,
          notes: dto.notes,
          guestEmail: dto.guestEmail ?? dto.billing.email,
          guestPhone: dto.guestPhone ?? dto.billing.phone,
          userId,
          couponCode: dto.couponCode,
          lines: { create: lineData },
          addresses: {
            create: [
              {
                type: OrderAddressType.billing,
                name: dto.billing.name,
                phone: dto.billing.phone,
                email: dto.billing.email,
                city: dto.billing.city,
                street: dto.billing.street,
              },
              ...(dto.shipping
                ? [
                    {
                      type: OrderAddressType.shipping,
                      name: dto.shipping.name,
                      phone: dto.shipping.phone,
                      email: dto.shipping.email,
                      city: dto.shipping.city,
                      street: dto.shipping.street,
                    },
                  ]
                : []),
            ],
          },
        },
        include: {
          lines: true,
          addresses: true,
        },
      });

      for (const line of dto.lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return created;
    });

    return this.toOrderResponse(order);
  }

  async findAll(userId?: string) {
    const where: Prisma.OrderWhereInput = userId ? { userId } : {};

    const orders = await this.prisma.order.findMany({
      where,
      include: { lines: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.toOrderListItem(o));
  }

  async findOne(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { lines: true, addresses: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { lines: true, addresses: true },
    });

    return this.toOrderResponse(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    return `KE-${1042 + count}`;
  }

  private toOrderListItem(
    order: Prisma.OrderGetPayload<{ include: { lines: true } }>,
  ) {
    const firstLine = order.lines[0];
    return {
      id: order.id,
      orderId: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      title: firstLine?.title ?? '',
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    };
  }

  private toOrderResponse(
    order: Prisma.OrderGetPayload<{
      include: { lines: true; addresses: true };
    }>,
  ) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingMethodId: this.shippingService.fromPrismaShippingMethodId(
        order.shippingMethodId,
      ),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      total: order.total,
      notes: order.notes,
      couponCode: order.couponCode,
      lines: order.lines.map((l) => ({
        productId: l.productId,
        title: l.title,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineTotal: l.lineTotal,
      })),
      billing: order.addresses.find((a) => a.type === OrderAddressType.billing),
      shipping: order.addresses.find(
        (a) => a.type === OrderAddressType.shipping,
      ),
      createdAt: order.createdAt.toISOString(),
    };
  }
}
