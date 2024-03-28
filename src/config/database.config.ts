import { User } from '../domain/user/entities/user.entity';
import { config } from 'dotenv';

config();

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABSE || 'db',
  entities: [User],
  synchronize: true,
  autoLoadEntities: true,
};
