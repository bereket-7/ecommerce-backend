export type DatabaseStatus = 'up' | 'down';

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  database: DatabaseStatus;
}
