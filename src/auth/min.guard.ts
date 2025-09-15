import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MinGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const atGuard = new (AuthGuard('jwt-access'))();
    const rtGuard = new (AuthGuard('jwt-refresh'))();

    try {
      if (await atGuard.canActivate(context)) return true;
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      return !!(await rtGuard.canActivate(context));
      // eslint-disable-next-line no-empty
    } catch {}

    return false;
  }
}
