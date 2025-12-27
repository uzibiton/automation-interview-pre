import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const group = await this.groupsService.getCurrentGroupForUser(String(userId));
    if (!group) {
      throw new HttpException('No group found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  @UseGuards(AuthGuard)
  @Get(':id/members')
  async getGroupMembers(@Param('id') groupId: string, @Req() req) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const members = await this.groupsService.getGroupMembers(groupId, String(userId));
    return members;
  }

  @UseGuards(AuthGuard)
  @Patch(':groupId/members/:memberId/role')
  async updateMemberRole(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Body('role') role: string,
    @Req() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return this.groupsService.updateMemberRole(groupId, memberId, role, String(userId));
  }

  @UseGuards(AuthGuard)
  @Delete(':groupId/members/:memberId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Req() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return this.groupsService.removeMember(groupId, memberId, String(userId));
  }
}
