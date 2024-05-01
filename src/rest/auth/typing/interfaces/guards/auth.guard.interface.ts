import { ExecutionContext } from '@nestjs/common';

export interface AuthGuardInterface {
  canActivate(context: ExecutionContext): Promise<boolean>;
}
