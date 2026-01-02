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

  // Helper to get the correct user ID (Firestore doc ID)
  private getUserId(req: any): string {
    console.log('[GroupsController] req.user:', JSON.stringify(req.user));
    const userId = req.user?.userId || req.user?.id;
    console.log('[GroupsController] extracted userId:', userId);
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return String(userId);
  }

  @UseGuards(AuthGuard)
  @Get('current')
  async getCurrentGroup(@Req() req) {
    const userId = this.getUserId(req);
    const group = await this.groupsService.getCurrentGroupForUser(userId);
    if (!group) {
      throw new HttpException('No group found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  @UseGuards(AuthGuard)
  @Get(':id/members')
  async getGroupMembers(@Param('id') groupId: string, @Req() req) {
    const userId = this.getUserId(req);
    const members = await this.groupsService.getGroupMembers(groupId, userId);
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
    const userId = this.getUserId(req);
    return this.groupsService.updateMemberRole(groupId, memberId, role, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':groupId/members/:memberId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Req() req,
  ) {
    const userId = this.getUserId(req);
    return this.groupsService.removeMember(groupId, memberId, userId);
  }
}
