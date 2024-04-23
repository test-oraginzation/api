import { LoggerService } from './logger.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  controllers: [],
  providers: [LoggerService],
})
export class LoggerModule {
  static forRoot(): any {
    return {
      module: LoggerModule,
      providers: [LoggerService],
      exports: [LoggerService],
    };
  }
}
