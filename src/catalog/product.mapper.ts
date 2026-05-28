import { Product as PrismaProduct, Category } from '@prisma/client';

export type ProductImages = {
  thumbnails: string[];
  previews: string[];
};

export type ProductOptionDto = {
  id: string;
  title: string;
};

export type ProductDto = {
  id: number;
  title: string;
  slug: string;
  description: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  category: string;
  brand?: string;
  material?: string;
  colors?: string[];
  setOptions?: ProductOptionDto[];
  specs?: Record<string, string>;
  imgs?: ProductImages;
};

type ProductWithCategory = PrismaProduct & { category: Category };

export function toProductDto(product: ProductWithCategory): ProductDto {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    reviews: product.reviewCount,
    price: product.price,
    discountedPrice: product.discountedPrice,
    category: product.category.name,
    brand: product.brand ?? undefined,
    material: product.material ?? undefined,
    colors: (product.colors as string[] | null) ?? undefined,
    setOptions: (product.setOptions as ProductOptionDto[] | null) ?? undefined,
    specs: (product.specs as Record<string, string> | null) ?? undefined,
    imgs: (product.imgs as ProductImages | null) ?? undefined,
  };
}
