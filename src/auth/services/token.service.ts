import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Document, Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { ValidationException } from 'exceptions/validation.exception';
import { v4 as uuidv4 } from 'uuid';
import {
  RefreshTokenPayload,
  AccessTokenPayload,
  ValidatedRefreshToken,
} from '../types/auth.types';
import { AUTH_CONSTANTS, AUTH_ERRORS } from '../constants/auth.constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(user: User & Document): string {
    const payload: AccessTokenPayload = {
      userId: user._id as string,
    };

    return this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
      secret: this.configService.get<string>('AT_SECRET')!,
    });
  }

  createRefreshToken(user: User & Document): string {
    const payload: RefreshTokenPayload = {
      userId: user._id as string,
      rtRef: user.refreshTokenRef,
    };

    return this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
      secret: this.configService.get<string>('RT_SECRET')!,
    });
  }

  async validateRefreshToken(
    refreshToken: string,
    userModel: Model<User>,
  ): Promise<ValidatedRefreshToken> {
    if (!refreshToken) {
      throw new ValidationException(
        [
          {
            field: 'refreshToken',
            messages: [AUTH_ERRORS.REFRESH_TOKEN_NOT_FOUND],
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('RT_SECRET')!,
      });
    } catch (error) {
      throw new ValidationException(
        [
          {
            field: 'refreshToken',
            messages: [AUTH_ERRORS.INVALID_REFRESH_TOKEN],
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await userModel.findOne({
      _id: payload.userId,
      refreshTokenRef: payload.rtRef,
    });

    if (!user) {
      throw new ValidationException(
        [
          {
            field: 'refreshToken',
            messages: [AUTH_ERRORS.INVALID_REFRESH_TOKEN],
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    return { user, payload };
  }

  generateRefreshTokenRef(): string {
    return uuidv4();
  }

  async revokeRefreshToken(user: User & Document): Promise<void> {
    user.refreshTokenRef = this.generateRefreshTokenRef();
    await user.save();
  }
}
