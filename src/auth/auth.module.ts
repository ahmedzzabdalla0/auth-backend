import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Schema
import { User, UserSchema } from 'schemas/user.schema';

// Services
import { AuthService } from './auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';
import { UserService } from './services/user.service';

// Controllers
import { AuthController } from './auth.controller';
import { AuthValidator } from './validators/auth.validator';

// Strategies
import { ATStrategy } from './strategies/at.strategy';
import { RTStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    CookieService,
    UserService,
    AuthValidator,
    ATStrategy,
    RTStrategy,
  ],
  exports: [
    AuthService,
    PasswordService,
    TokenService,
    CookieService,
    UserService,
    AuthValidator,
  ],
})
export class AuthModule {}
