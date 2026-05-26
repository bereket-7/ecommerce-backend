import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toProductDto } from '../catalog/product.mapper';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      product: toProductDto(item.product),
      createdAt: item.createdAt.toISOString(),
    }));
  }

  async add(userId: string, productId: number) {
    await this.prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: { userId, productId },
      update: {},
    });

    return { added: true, productId };
  }

  async remove(userId: string, productId: number) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
    return { removed: true, productId };
  }
}
