import { Global, Module } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';

@Global()
@Module({
  controllers: [],
  providers: [FcmNotificationService],
})
export class FcmNotificationModule {
  static forRoot(): any {
    return {
      module: FcmNotificationModule,
      providers: [FcmNotificationService],
      exports: [FcmNotificationService],
    };
  }
}
