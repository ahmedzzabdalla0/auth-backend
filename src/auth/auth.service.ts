import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'exceptions/validation.exception';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto, res: Response) {
    const { name, email, password } = signupDto;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new ValidationException(
        [{ field: 'email', messages: ['User already exists'] }],
        HttpStatus.CONFLICT,
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      name,
      email,
      passwordHash,
    });
    await createdUser.save();
    res.cookie('refresh_token', this.createRefreshToken(createdUser), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    return {
      createdUser,
      accessToken: this.createAccessToken(createdUser),
    };
  }

  async login({ email, password, rememberMe }: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new ValidationException(
        [{ field: 'email', messages: ['User not found'] }],
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ValidationException(
        [{ field: 'password', messages: ['Invalid password'] }],
        HttpStatus.UNAUTHORIZED,
      );
    }
    res.cookie('refresh_token', this.createRefreshToken(user), {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      ...(rememberMe ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}),
    });
    return {
      ...user.toObject(),
      accessToken: this.createAccessToken(user),
    };
  }

  async refresh(req: Request) {
    const refreshToken = req?.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      throw new ValidationException(
        [{ field: 'refreshToken', messages: ['Refresh token not found'] }],
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { userId, rtRef } = this.jwtService.verify<{
      userId: string;
      rtRef: string;
    }>(refreshToken, {
      secret: this.configService.get<string>('RT_SECRET')!,
    });
    const user = await this.userModel.findOne({
      _id: userId,
      refreshTokenRef: rtRef,
    });
    if (!user) {
      throw new ValidationException(
        [{ field: 'refreshToken', messages: ['Invalid refresh token'] }],
        HttpStatus.UNAUTHORIZED,
      );
    }
    const newAccessToken = this.createAccessToken(user);
    return { accessToken: newAccessToken };
  }

  async getUser(req: Request) {
    const user = await this.userModel.findById(
      (req.user as User & Document)._id,
    );
    if (!user) {
      throw new ValidationException(
        [{ field: 'user', messages: ['User not found'] }],
        HttpStatus.NOT_FOUND,
      );
    }
    return { user };
  }

  logout(res: Response) {
    res.clearCookie('refresh_token');
    return { message: 'Successfully logged out' };
  }

  async resetRefresh(req: Request, res: Response) {
    const refreshToken = req?.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      throw new ValidationException(
        [{ field: 'refreshToken', messages: ['Refresh token not found'] }],
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { userId, rtRef } = this.jwtService.verify<{
      userId: string;
      rtRef: string;
    }>(refreshToken, {
      secret: this.configService.get<string>('RT_SECRET')!,
    });
    const user = await this.userModel.findOne({
      _id: userId,
      refreshTokenRef: rtRef,
    });
    if (!user) {
      throw new ValidationException(
        [{ field: 'refreshToken', messages: ['Invalid refresh token'] }],
        HttpStatus.UNAUTHORIZED,
      );
    }
    const newRefreshTokenRef = uuidv4();
    user.refreshTokenRef = newRefreshTokenRef;
    const newRefreshToken = this.createRefreshToken(user);
    await user.save();
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    return { message: 'Successfully reset the refresh token.' };
  }

  createRefreshToken(user: User & Document): string {
    const refreshToken = this.jwtService.sign(
      { userId: user._id as string, rtRef: user.refreshTokenRef },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('RT_SECRET')!,
      },
    );
    return refreshToken;
  }

  createAccessToken(user: User & Document): string {
    const accessToken = this.jwtService.sign(
      { userId: user._id as string },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('AT_SECRET')!,
      },
    );
    return accessToken;
  }
}
