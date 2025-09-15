import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { MinGuard } from './guards/min.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signup(signupDto, res);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('refreshToken')
  async refresh(@Req() req: Request) {
    return this.authService.refresh(req);
  }

  @Get('get_user')
  @UseGuards(AuthGuard('jwt-access'))
  @ApiBearerAuth()
  getUser(@Req() req: Request) {
    return this.authService.getUser(req);
  }

  @ApiResponse({
    status: 201,
    description:
      'Invalidate stolen refresh token and keep the current session active. All other sessions will be logged out once their access token expires, the page is refreshed, or an authenticated action is attempted.',
  })
  @Post('report_refresh_stolen')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('refreshToken')
  async resetRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetRefresh(req, res);
  }

  @Post('logout')
  @UseGuards(MinGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
