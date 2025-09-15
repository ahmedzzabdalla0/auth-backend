import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model, ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('AT_SECRET')!,
    });
  }

  async validate(payload: { userId?: ObjectId }): Promise<User> {
    const user = await this.userModel.findById(payload.userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
