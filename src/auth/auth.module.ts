import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { AuthController } from './auth.controller';
import { ATStrategy } from './at.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RTStrategy } from './rt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, ATStrategy, RTStrategy],
})
export class AuthModule {}
