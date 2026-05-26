import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';
import type { HealthResponse } from './health.types';

const healthExample: HealthResponse = {
  status: 'ok',
  timestamp: '2026-05-21T12:00:00.000Z',
  database: 'up',
};

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: 'Liveness — process is running (always 200)',
    schema: { example: healthExample },
  })
  async live(): Promise<HealthResponse> {
    const database = await this.healthService.getDatabaseStatus();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database,
    };
  }

  @Get('ready')
  @ApiOkResponse({
    description: 'Readiness — dependencies are available',
    schema: { example: healthExample },
  })
  @ApiServiceUnavailableResponse({
    description: 'Database unavailable',
  })
  async ready(): Promise<HealthResponse> {
    const database = await this.healthService.getDatabaseStatus();

    if (database === 'down') {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp: new Date().toISOString(),
        database,
      });
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database,
    };
  }
}
