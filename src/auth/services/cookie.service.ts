import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { CookieOptions } from '../types/auth.types';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  private getSecureCookieOptions(rememberMe?: boolean): CookieOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      ...(rememberMe
        ? { maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE }
        : {}),
    };
  }

  setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    rememberMe?: boolean,
  ): void {
    const options = this.getSecureCookieOptions(rememberMe);
    res.cookie(AUTH_CONSTANTS.COOKIE_NAME, refreshToken, options);
  }

  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(AUTH_CONSTANTS.COOKIE_NAME);
  }

  getRefreshTokenFromCookies(cookies: any): string | undefined {
    return cookies?.[AUTH_CONSTANTS.COOKIE_NAME];
  }
}
