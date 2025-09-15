import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'schemas/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Protected Area')
@UseGuards(AuthGuard('jwt-access'))
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/content')
  getContent(@Req() req: Request & { user: User }) {
    return this.dashboardService.getContent(req.user);
  }
}
