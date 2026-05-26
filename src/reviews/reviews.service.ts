import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductSlug(slug: string) {
    const product = await this.getProductBySlug(slug);

    const reviews = await this.prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      body: r.body,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async create(slug: string, dto: CreateReviewDto, userId?: string) {
    const product = await this.getProductBySlug(slug);

    const review = await this.prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          productId: product.id,
          userId,
          authorName: dto.authorName,
          rating: dto.rating,
          body: dto.body,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { reviewCount: { increment: 1 } },
      });

      return created;
    });

    return {
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
    };
  }

  private async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }
    return product;
  }
}
