import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

type AuthRequest = Request & { user?: { userId: string } };

@ApiTags('reviews')
@Controller('products')
export class ProductReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':slug/reviews')
  findAll(@Param('slug') slug: string) {
    return this.reviewsService.findByProductSlug(slug);
  }

  @Post(':slug/reviews')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @Req() req: AuthRequest,
  ) {
    return this.reviewsService.create(slug, dto, req.user?.userId);
  }
}
