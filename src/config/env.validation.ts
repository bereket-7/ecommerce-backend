import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const normalized = {
    DATABASE_URL: config.DATABASE_URL,
    PORT: config.PORT ?? '4000',
    CORS_ORIGIN: config.CORS_ORIGIN ?? 'http://localhost:3000',
    NODE_ENV: config.NODE_ENV ?? 'development',
    JWT_SECRET: config.JWT_SECRET ?? 'dev-jwt-secret-change-in-production',
  };

  const validated = plainToInstance(EnvironmentVariables, normalized, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
