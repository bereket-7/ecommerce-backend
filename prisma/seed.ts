import { DiscountType, PrismaClient } from '@prisma/client';
import { seedCategories, seedProducts } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderLine.deleteMany();
  await prisma.orderAddress.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const categoryByName = new Map<string, number>();

  for (const cat of seedCategories) {
    const created = await prisma.category.create({
      data: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        imagePath: cat.imagePath,
        sortOrder: cat.sortOrder,
      },
    });
    categoryByName.set(created.name, created.id);
  }

  for (const product of seedProducts) {
    const categoryId = categoryByName.get(product.categoryName);
    if (!categoryId) {
      throw new Error(`Unknown category: ${product.categoryName}`);
    }

    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        discountedPrice: product.discountedPrice,
        reviewCount: product.reviews,
        categoryId,
        brand: product.brand,
        material: product.material,
        colors: product.colors ?? undefined,
        setOptions: product.setOptions ?? undefined,
        specs: product.specs ?? undefined,
        imgs: product.imgs,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'ADDIS25' },
    update: {},
    create: {
      code: 'ADDIS25',
      discountType: DiscountType.percent,
      value: 25,
      minSubtotal: 0,
      active: true,
    },
  });

  console.log(`Seeded ${seedCategories.length} categories and ${seedProducts.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
