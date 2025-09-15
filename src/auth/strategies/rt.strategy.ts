import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';
@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RTStrategy.extractJWT]),
      secretOrKey: configService.get('RT_SECRET')!,
    });
  }
  private static extractJWT(this: void, req: RequestType): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      const token = req.cookies.refresh_token as string | undefined;
      if (token?.length) return token;
    }
    return null;
  }
  async validate(payload: { userId?: string; rtRef?: string }): Promise<User> {
    const { userId, rtRef } = payload;
    const user = await this.userModel.findOne({
      _id: userId,
      refreshTokenRef: rtRef,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
