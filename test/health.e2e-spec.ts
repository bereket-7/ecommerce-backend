import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/create-app';
import type { HealthResponse } from '../src/health/health.types';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApp();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('GET /api/v1/health returns 200 with status ok', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as HealthResponse;
        expect(body.status).toBe('ok');
        expect(body.timestamp).toBeDefined();
        expect(['up', 'down']).toContain(body.database);
      });
  });

  it('GET /api/v1/health/ready returns 200 or 503 based on database', async () => {
    const liveRes = await request(app.getHttpServer()).get('/api/v1/health');
    const body = liveRes.body as HealthResponse;

    const readyReq = request(app.getHttpServer()).get('/api/v1/health/ready');

    if (body.database === 'up') {
      await readyReq.expect(200).expect((res) => {
        const ready = res.body as HealthResponse;
        expect(ready.status).toBe('ok');
        expect(ready.database).toBe('up');
      });
    } else {
      await readyReq.expect(503);
    }
  });
});
