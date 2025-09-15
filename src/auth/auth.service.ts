import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { ValidationException } from 'exceptions/validation.exception';
import type { Request, Response } from 'express';

// Services
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';
import { UserService } from './services/user.service';

// Types and Constants
import { AuthResponse, SignupResponse } from './types/auth.types';
import { AUTH_ERRORS, AUTH_MESSAGES } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: SignupDto, res: Response): Promise<SignupResponse> {
    const { name, email, password } = signupDto;

    // Validate password strength
    const passwordValidation =
      this.passwordService.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new ValidationException(
        [{ field: 'password', messages: passwordValidation.errors }],
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if user already exists
    await this.userService.checkUserExists(email);

    // Hash password and generate refresh token reference
    const passwordHash = await this.passwordService.hashPassword(password);
    const refreshTokenRef = this.tokenService.generateRefreshTokenRef();

    // Create user
    const createdUser = await this.userService.createUser({
      name,
      email,
      passwordHash,
      refreshTokenRef,
    });

    // Generate tokens
    const accessToken = this.tokenService.createAccessToken(createdUser);
    const refreshToken = this.tokenService.createRefreshToken(createdUser);

    // Set refresh token cookie
    this.cookieService.setRefreshTokenCookie(res, refreshToken, true);

    return {
      createdUser,
      accessToken,
    };
  }

  async login(
    { email, password, rememberMe }: LoginDto,
    res: Response,
  ): Promise<AuthResponse> {
    // Validate user exists
    const user = await this.userService.validateUserExists(email);

    // Validate password
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ValidationException(
        [{ field: 'password', messages: [AUTH_ERRORS.INVALID_PASSWORD] }],
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Generate tokens
    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = this.tokenService.createRefreshToken(user);

    // Set refresh token cookie
    this.cookieService.setRefreshTokenCookie(res, refreshToken, rememberMe);

    return {
      user: this.userService.sanitizeUserResponse(user),
      accessToken,
    };
  }

  async refresh(req: Request): Promise<{ accessToken: string }> {
    const refreshToken = this.cookieService.getRefreshTokenFromCookies(
      req.cookies,
    );

    // Validate refresh token and get user
    const { user } = await this.tokenService.validateRefreshToken(
      refreshToken!,
      this.userModel,
    );

    // Generate new access token
    const newAccessToken = this.tokenService.createAccessToken(user);

    return { accessToken: newAccessToken };
  }

  async getUser(req: Request): Promise<{ user: Partial<User> }> {
    const userId = (req.user as User & Document)._id as ObjectId;
    const user = await this.userService.validateUserExistsById(userId);

    return {
      user: this.userService.sanitizeUserResponse(user),
    };
  }

  logout(res: Response): { message: string } {
    this.cookieService.clearRefreshTokenCookie(res);
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  async resetRefresh(
    req: Request,
    res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = this.cookieService.getRefreshTokenFromCookies(
      req.cookies,
    );

    // Validate refresh token and get user
    const { user } = await this.tokenService.validateRefreshToken(
      refreshToken!,
      this.userService.userModel,
    );

    // Generate new refresh token reference and token
    await this.tokenService.revokeRefreshToken(user);
    const newRefreshToken = this.tokenService.createRefreshToken(user);

    // Set new refresh token cookie
    this.cookieService.setRefreshTokenCookie(res, newRefreshToken, true);

    return { message: AUTH_MESSAGES.REFRESH_TOKEN_RESET_SUCCESS };
  }

  // Legacy methods for backward compatibility
  createRefreshToken(user: User & Document): string {
    return this.tokenService.createRefreshToken(user);
  }

  createAccessToken(user: User & Document): string {
    return this.tokenService.createAccessToken(user);
  }
}
