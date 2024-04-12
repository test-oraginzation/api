import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './rest/user/users.module';
import { AuthModule } from './rest/auth/auth.module';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { WishModule } from './rest/wish/wish.module';
import { ListModule } from './rest/list/list.module';
import { MinioModule } from './libs/minio/minio.module';
import { SubscriptionModule } from './rest/subscription/subscription.module';
import { MailerModule } from './libs/mailer/mailer.module';
import { RedisModule } from './libs/redis/redis.module';
import { RedisService } from './libs/redis/services/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: databaseConfig.entities,
      synchronize: databaseConfig.synchronize,
      autoLoadEntities: databaseConfig.autoLoadEntities,
    }),
    UsersModule,
    AuthModule,
    WishModule,
    ListModule,
    MinioModule,
    SubscriptionModule,
    MailerModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly redisService: RedisService) {}

  async onApplicationBootstrap() {
    await this.redisService.checkConnection();
  }
}
