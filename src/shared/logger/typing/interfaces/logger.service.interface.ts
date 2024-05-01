import { LogLevel } from '../../logger.service';

export interface LoggerServiceInterface {
  log(message: string, userId: number, level: LogLevel): Promise<void>;
  getLogsByUserId(userId: number): Promise<string[]>;
}
