import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { DatabaseStatus } from './health.types';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    try {
      await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);
      return 'up';
    } catch {
      return 'down';
    }
  }
}
