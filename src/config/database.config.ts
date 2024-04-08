import { User } from '../domain/user/entities/user.entity';
import { config } from 'dotenv';
import { Wish } from '../domain/wish/entities/wish.entity';
import { List } from '../domain/list/entities/list.entity';
import { Subscription } from '../domain/subscription/entities/subscription.entity';

config();

export default {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  database: process.env.DATABASE_DB || 'wishlist',
  entities: [User, Wish, List, Subscription],
  synchronize: true,
  autoLoadEntities: true,
};
