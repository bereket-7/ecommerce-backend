import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/create-app';
import { isDatabaseUp } from './e2e-helpers';

type AuthResponse = {
  accessToken: string;
};

type CreatedOrderResponse = {
  id: string;
  orderNumber: string;
};

type WishlistListItem = {
  id: string;
};

type ReviewItem = {
  id: string;
};

type PaymentInitiateResponse = {
  redirectUrl: string;
};

type PaymentWebhookResponse = {
  paymentStatus: string;
};

describe('Engagement and Payments (e2e)', () => {
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

  it('supports wishlist add/list/remove for authenticated users', async () => {
    if (!dbUp) {
      return;
    }

    const email = `wishlist-${Date.now()}@kitchenedge.test`;

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password: 'password123', name: 'Wishlist User' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    const { accessToken } = loginRes.body as AuthResponse;

    await request(app.getHttpServer())
      .post('/api/v1/wishlist/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const listRes = await request(app.getHttpServer())
      .get('/api/v1/wishlist')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const wishlistBody = listRes.body as WishlistListItem[];

    expect(Array.isArray(wishlistBody)).toBe(true);
    expect(wishlistBody.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .delete('/api/v1/wishlist/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('creates and lists product reviews', async () => {
    if (!dbUp) {
      return;
    }

    const slug = 'professional-8-piece-chef-knife-set';

    await request(app.getHttpServer())
      .post(`/api/v1/products/${slug}/reviews`)
      .send({
        authorName: 'Review User',
        rating: 5,
        body: 'Excellent quality and very sharp.',
      })
      .expect(201);

    const listRes = await request(app.getHttpServer())
      .get(`/api/v1/products/${slug}/reviews`)
      .expect(200);
    const reviewsBody = listRes.body as ReviewItem[];

    expect(Array.isArray(reviewsBody)).toBe(true);
    expect(reviewsBody.length).toBeGreaterThan(0);
  });

  it('accepts contact and newsletter submissions', async () => {
    if (!dbUp) {
      return;
    }

    await request(app.getHttpServer())
      .post('/api/v1/contact')
      .send({
        name: 'Contact User',
        subject: 'Help needed',
        phone: '+251911111111',
        message: 'Please call me back.',
      })
      .expect(201);

    const email = `newsletter-${Date.now()}@kitchenedge.test`;
    await request(app.getHttpServer())
      .post('/api/v1/newsletter/subscribe')
      .send({ email })
      .expect(201);
  });

  it('initiates telebirr payment and handles webhook update', async () => {
    if (!dbUp) {
      return;
    }

    const orderRes = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({
        lines: [{ productId: 1, quantity: 1 }],
        billing: {
          name: 'Payment User',
          phone: '+251922222222',
          email: `payment-${Date.now()}@kitchenedge.test`,
          city: 'Addis Ababa',
          street: 'Kazanchis',
        },
        shippingMethodId: 'addis-standard',
        paymentMethod: 'telebirr',
      })
      .expect(201);

    const orderBody = orderRes.body as CreatedOrderResponse;

    const initiateRes = await request(app.getHttpServer())
      .post('/api/v1/payments/initiate')
      .send({ orderId: orderBody.id, provider: 'telebirr' })
      .expect(201);
    const initiateBody = initiateRes.body as PaymentInitiateResponse;

    expect(initiateBody.redirectUrl).toContain('/telebirr');

    const webhookRes = await request(app.getHttpServer())
      .post('/api/v1/payments/webhooks/telebirr')
      .send({ orderNumber: orderBody.orderNumber, status: 'paid' })
      .expect(201);
    const webhookBody = webhookRes.body as PaymentWebhookResponse;

    expect(webhookBody.paymentStatus).toBe('paid');
  });
});
