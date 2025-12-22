import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthGuard)
  @Get('current')
  async getCurrentGroup(@Req() req) {
    const userId = req.user?.userId;
    if (!userId) {
      return { error: 'User not authenticated' };
    }
    return this.groupsService.getCurrentGroupForUser(userId);
  }
}
