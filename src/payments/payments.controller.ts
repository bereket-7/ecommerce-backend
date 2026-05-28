import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(dto);
  }

  @Post('webhooks/telebirr')
  telebirrWebhook(@Body() body: { orderNumber?: string; status?: string }) {
    return this.paymentsService.handleWebhook('telebirr', body);
  }

  @Post('webhooks/cbe')
  cbeWebhook(@Body() body: { orderNumber?: string; status?: string }) {
    return this.paymentsService.handleWebhook('cbe', body);
  }
}
