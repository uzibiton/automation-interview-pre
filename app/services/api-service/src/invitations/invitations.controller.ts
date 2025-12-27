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

  @UseGuards(AuthGuard)
  @Get()
  async getInvitations(@Query('groupId') groupId: string, @Req() req) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    if (!groupId) {
      throw new HttpException('groupId query parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.invitationsService.getInvitationsByGroupId(groupId, String(userId));
  }

  @UseGuards(AuthGuard)
  @Post()
  async createInvitation(
    @Body('groupId') groupId: string,
    @Body('email') email: string,
    @Body('role') role: string,
    @Req() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    if (!groupId || !email) {
      throw new HttpException('groupId and email are required', HttpStatus.BAD_REQUEST);
    }

    return this.invitationsService.createInvitation(groupId, email, role, String(userId));
  }

  @Get(':token')
  async getInvitationByToken(@Param('token') token: string) {
    return this.invitationsService.getInvitationByToken(token);
  }

  @UseGuards(AuthGuard)
  @Post(':token/accept')
  async acceptInvitation(@Param('token') token: string, @Req() req) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return this.invitationsService.acceptInvitation(token, String(userId));
  }

  @Post(':token/decline')
  async declineInvitation(@Param('token') token: string) {
    return this.invitationsService.declineInvitation(token);
  }
}
