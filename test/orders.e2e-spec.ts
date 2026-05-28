import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/create-app';
import { isDatabaseUp } from './e2e-helpers';

type ShippingMethod = {
  id: string;
  price: number;
};

type OrderResponse = {
  orderNumber: string;
  total: number;
};

type CouponValidation = {
  valid: boolean;
  discountAmount: number;
};

describe('Orders (e2e)', () => {
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

  it('GET /api/v1/shipping/methods returns methods with prices', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/shipping/methods?subtotal=5000')
      .expect(200);

    const body = res.body as ShippingMethod[];
    expect(body).toHaveLength(3);
    expect(body[0]?.id).toBe('addis-standard');
    expect(body[0]?.price).toBe(0);
  });

  it('POST /api/v1/orders creates an order when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({
        lines: [{ productId: 1, quantity: 1 }],
        billing: {
          name: 'Test User',
          phone: '+251911000000',
          email: 'test@example.com',
          city: 'Addis Ababa',
          street: 'Bole Road',
        },
        shippingMethodId: 'addis-standard',
        paymentMethod: 'cash',
      })
      .expect(201);

    const body = res.body as OrderResponse;
    expect(body.orderNumber).toMatch(/^KE-/);
    expect(body.total).toBeGreaterThan(0);
  });

  it('POST /api/v1/coupons/validate validates ADDIS25 when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const res = await request(app.getHttpServer())
      .post('/api/v1/coupons/validate')
      .send({ code: 'ADDIS25', subtotal: 10000 })
      .expect(201);

    const body = res.body as CouponValidation;
    expect(body.valid).toBe(true);
    expect(body.discountAmount).toBe(2500);
  });
});
