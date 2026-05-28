import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/create-app';
import { isDatabaseUp } from './e2e-helpers';

type AuthResponse = {
  accessToken: string;
};

type ProfileResponse = {
  email: string;
};

describe('Auth (e2e)', () => {
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

  it('registers and logs in a user when DB is up', async () => {
    if (!dbUp) {
      return;
    }

    const email = `user-${Date.now()}@kitchenedge.test`;

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Test User',
      })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    const loginBody = loginRes.body as AuthResponse;
    expect(loginBody.accessToken).toBeDefined();

    const meRes = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);

    const meBody = meRes.body as ProfileResponse;
    expect(meBody.email).toBe(email);
  });
});
