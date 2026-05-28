import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('methods')
  @ApiQuery({ name: 'subtotal', type: Number, required: true })
  @ApiOkResponse({
    description: 'Available shipping methods with computed prices',
  })
  getMethods(@Query('subtotal') subtotalRaw: string) {
    const subtotal = parseInt(subtotalRaw, 10) || 0;
    return this.shippingService.getMethods(subtotal);
  }
}
