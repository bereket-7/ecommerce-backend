import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

type AuthRequest = Request & { user: { userId: string } };

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.wishlistService.list(req.user.userId);
  }

  @Post(':productId')
  add(@Req() req: AuthRequest, @Param('productId') productId: string) {
    return this.wishlistService.add(req.user.userId, parseInt(productId, 10));
  }

  @Delete(':productId')
  remove(@Req() req: AuthRequest, @Param('productId') productId: string) {
    return this.wishlistService.remove(
      req.user.userId,
      parseInt(productId, 10),
    );
  }
}
