import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

@Injectable()
export class LoggerService {
  private loggers: { [key: string]: winston.Logger } = {};

  constructor() {}

  private getLogger(userId: number): winston.Logger {
    if (!this.loggers[userId]) {
      this.loggers[userId] = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        transports: [
          new winston.transports.File({
            filename: `logs/user-${userId}.log`,
          }),
        ],
      });
    }
    return this.loggers[userId];
  }

  async log(message: string, userId: number, level: LogLevel): Promise<void> {
    const logger = this.getLogger(userId);
    const logMessage = `${level}: user-${userId}: ${message}`;
    logger.log({ level, message: logMessage });
  }

  async getLogsByUserId(userId: string): Promise<string[]> {
    const logFilePath = `logs/user-${userId}.log`;
    if (fs.existsSync(logFilePath)) {
      return fs.readFileSync(logFilePath, 'utf8').split('\n');
    }
    return [];
  }
}
