import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'schemas/user.schema';

@UseGuards(AuthGuard('jwt-access'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/content')
  content(@Req() req: Request & { user: User }) {
    return this.dashboardService.content(req.user);
  }
}
