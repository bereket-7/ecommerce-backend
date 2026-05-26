import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { HealthResponse } from '../src/health/health.types';

export async function isDatabaseUp(app: INestApplication): Promise<boolean> {
  const res = await request(app.getHttpServer()).get('/api/v1/health');
  const body = res.body as HealthResponse;
  return body.database === 'up';
}
