import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/create-app';
import { isDatabaseUp } from './e2e-helpers';

type CategoryItem = {
  id: number;
  title: string;
  slug: string;
};

type PaginatedProducts = {
  data: unknown[];
  total: number;
};

type ProductDetail = {
  slug: string;
  discountedPrice: number;
};

type ProductFacets = {
  categories: unknown;
  brands: unknown;
};

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  let dbUp = false;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    dbUp = await isDatabaseUp(app);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/v1/categories returns categories when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);

    const body = res.body as CategoryItem[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    const first = body[0];
    expect(typeof first?.id).toBe('number');
    expect(typeof first?.title).toBe('string');
    expect(typeof first?.slug).toBe('string');
  });

  it('GET /api/v1/products returns paginated products when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200);

    const body = res.body as PaginatedProducts;
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThanOrEqual(15);
  });

  it('GET /api/v1/products/:slug returns a product when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .get('/api/v1/products/professional-8-piece-chef-knife-set')
      .expect(200);

    const body = res.body as ProductDetail;
    expect(body.slug).toBe('professional-8-piece-chef-knife-set');
    expect(body.discountedPrice).toBe(8500);
  });

  it('GET /api/v1/products/facets returns facet counts when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .get('/api/v1/products/facets')
      .expect(200);

    const body = res.body as ProductFacets;
    expect(body.categories).toBeDefined();
    expect(body.brands).toBeDefined();
  });
});
