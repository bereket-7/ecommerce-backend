import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductDto, toProductDto } from './product.mapper';

export type FilterOption = { name: string; count: number };

export type ProductFacetsDto = {
  categories: FilterOption[];
  brands: FilterOption[];
  materials: FilterOption[];
  colors: FilterOption[];
  priceMin: number;
  priceMax: number;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;

    if (query.color) {
      const where = this.buildWhere({ ...query, color: undefined });
      const all = await this.prisma.product.findMany({
        where,
        include: { category: true },
      });
      const filtered = all.filter((p) =>
        (p.colors as string[] | null)?.includes(query.color!),
      );
      const sorted = this.sortProducts(filtered, query.sort);
      const total = sorted.length;
      const pageItems = sorted.slice((page - 1) * limit, page * limit);

      return {
        data: pageItems.map(toProductDto),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query.sort);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(toProductDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlug(slug: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }

    return toProductDto(product);
  }

  async getFacets(query: ListProductsQueryDto): Promise<ProductFacetsDto> {
    const products = await this.prisma.product.findMany({
      where: this.buildWhere(query),
      include: { category: true },
    });

    const dtos = products.map(toProductDto);
    return this.computeFacets(dtos);
  }

  private buildWhere(query: ListProductsQueryDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (query.q?.trim()) {
      const q = query.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { material: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = query.brand;
    }

    if (query.material) {
      where.material = query.material;
    }

    // Color filter applied after fetch when using JSON array field

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.discountedPrice = {};
      if (query.minPrice !== undefined) {
        where.discountedPrice.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.discountedPrice.lte = query.maxPrice;
      }
    }

    return where;
  }

  private sortProducts(
    products: Prisma.ProductGetPayload<{ include: { category: true } }>[],
    sort?: ListProductsQueryDto['sort'],
  ) {
    const copy = [...products];
    switch (sort) {
      case 'best-selling':
        copy.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        copy.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        copy.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'latest':
      default:
        copy.sort((a, b) => b.id - a.id);
        break;
    }
    return copy;
  }

  private buildOrderBy(
    sort?: ListProductsQueryDto['sort'],
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'best-selling':
        return [{ reviewCount: 'desc' }];
      case 'price-low':
        return [{ discountedPrice: 'asc' }];
      case 'price-high':
        return [{ discountedPrice: 'desc' }];
      case 'latest':
      default:
        return [{ id: 'desc' }];
    }
  }

  private computeFacets(products: ProductDto[]): ProductFacetsDto {
    const countBy = (getter: (p: ProductDto) => string | undefined) => {
      const map = new Map<string, number>();
      products.forEach((p) => {
        const value = getter(p);
        if (value) {
          map.set(value, (map.get(value) ?? 0) + 1);
        }
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    const colors = new Map<string, number>();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        colors.set(c, (colors.get(c) ?? 0) + 1);
      });
    });

    const prices = products.map((p) => p.discountedPrice);

    return {
      categories: countBy((p) => p.category),
      brands: countBy((p) => p.brand),
      materials: countBy((p) => p.material),
      colors: Array.from(colors.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    };
  }
}
