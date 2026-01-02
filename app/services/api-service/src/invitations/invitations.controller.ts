import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // Helper to get the correct user ID (Firestore doc ID)
  private getUserId(req: any): string {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return String(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getInvitations(@Query('groupId') groupId: string, @Req() req) {
    const userId = this.getUserId(req);

    if (!groupId) {
      throw new HttpException('groupId query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.invitationsService.getInvitationsByGroupId(groupId, userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createInvitation(
    @Body('groupId') groupId: string,
    @Body('email') email: string,
    @Body('role') role: string,
    @Req() req,
  ) {
    const userId = this.getUserId(req);

    if (!groupId || !email) {
      throw new HttpException('groupId and email are required', HttpStatus.BAD_REQUEST);
    }

    return this.invitationsService.createInvitation(groupId, email, role, userId);
  }

  @Get(':token')
  async getInvitationByToken(@Param('token') token: string) {
    return this.invitationsService.getInvitationByToken(token);
  }

  @UseGuards(AuthGuard)
  @Post(':token/accept')
  async acceptInvitation(@Param('token') token: string, @Req() req) {
    const userId = this.getUserId(req);
    return this.invitationsService.acceptInvitation(token, userId);
  }

  @Post(':token/decline')
  async declineInvitation(@Param('token') token: string) {
    return this.invitationsService.declineInvitation(token);
  }
}
