import { DataSource, DataSourceOptions } from 'typeorm';

export const defaultOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5490,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'financial-management',
  logging: false,
  synchronize: false,
  migrationsRun: false,
  ssl: process.env.DB_SSL === 'true',
  entities: ['dist/**/*.entity.js'],
  migrations: process.env.TYPEORM
    ? ['src/infra/migrations/*.ts']
    : ['dist/infra/migrations/*.js'],
} as DataSourceOptions;

export const typeOrmConnectionDataSource = new DataSource(defaultOptions);
