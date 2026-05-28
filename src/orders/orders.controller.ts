import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

type OptionalAuthRequest = Request & { user?: { userId: string } };
type AuthRequest = Request & { user: { userId: string } };

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Create a new order' })
  create(@Body() dto: CreateOrderDto, @Req() req: OptionalAuthRequest) {
    return this.ordersService.create(dto, req.user?.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Req() req: AuthRequest) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update order status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.updateStatus(id, dto, req.user.userId);
  }
}
