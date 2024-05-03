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
import { FollowModule } from './rest/follow/follow.module';
import { MailerModule } from './libs/mailer/mailer.module';
import { RedisModule } from './libs/redis/redis.module';
import { RedisService } from './libs/redis/services/redis.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/jwt.config';
import { SeedService } from './shared/seed/seed.service';
import { LoggerService } from './shared/logger/logger.service';
import { LoggerModule } from './shared/logger/logger.module';
import { FcmNotificationModule } from './libs/fcm-notification/fcm-notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    JwtModule.register(JwtConfig),
    UsersModule,
    AuthModule,
    WishModule,
    ListModule,
    MinioModule,
    FollowModule,
    MailerModule,
    RedisModule,
    LoggerModule.forRoot(),
    FcmNotificationModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, LoggerService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly redisService: RedisService) {}

  async onApplicationBootstrap() {
    await this.redisService.checkConnection();
  }
}
