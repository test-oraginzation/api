import { Module } from '@nestjs/common';
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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
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
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
