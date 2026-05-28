import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductReviewsController } from './product-reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
