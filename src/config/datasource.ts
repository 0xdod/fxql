import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const postgresConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [],
  migrations: [path.join(__dirname, 'migrations/*.{js,ts}')],
  synchronize: false,
  dropSchema: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(postgresConfig);

export default dataSource;
