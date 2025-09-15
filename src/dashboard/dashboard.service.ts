import { Injectable } from '@nestjs/common';
import { User } from 'schemas/user.schema';

@Injectable()
export class DashboardService {
  getContent(user: User) {
    return {
      message: `This is message comes from backend. If you see this message you are authorized. Your email is ${user.email}`,
    };
  }
}
