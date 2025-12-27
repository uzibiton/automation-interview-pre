import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirestoreRepository } from '../database/firestore.repository';

@Injectable()
export class InvitationsService {
  constructor(private readonly firestore: FirestoreRepository) {}

  async getInvitationsByGroupId(groupId: string, requestingUserId: string) {
    // Verify the requesting user is a member of the group
    const group = await this.firestore.findGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (!group.members?.includes(requestingUserId)) {
      throw new HttpException('Not authorized to view invitations', HttpStatus.FORBIDDEN);
    }

    return this.firestore.getInvitationsByGroupId(groupId);
  }

  async createInvitation(
    groupId: string,
    email: string,
    role: string,
    requestingUserId: string,
  ) {
    // Verify the requesting user is an admin/owner of the group
    const group = await this.firestore.findGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const isOwner = group.ownerId === requestingUserId;
    if (!isOwner) {
      throw new HttpException('Only the owner can send invitations', HttpStatus.FORBIDDEN);
    }

    return this.firestore.createInvitation({
      groupId,
      email,
      invitedBy: requestingUserId,
      role: role || 'member',
    });
  }

  async getInvitationByToken(token: string) {
    const invitation = await this.firestore.getInvitationByToken(token);
    if (!invitation) {
      throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new HttpException('Invitation is no longer valid', HttpStatus.BAD_REQUEST);
    }

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      throw new HttpException('Invitation has expired', HttpStatus.BAD_REQUEST);
    }

    // Get group details to return with invitation
    const group = await this.firestore.findGroupById(invitation.groupId);

    return {
      ...invitation,
      groupName: group?.name || 'Unknown Group',
    };
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.firestore.getInvitationByToken(token);
    if (!invitation) {
      throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new HttpException('Invitation is no longer valid', HttpStatus.BAD_REQUEST);
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      throw new HttpException('Invitation has expired', HttpStatus.BAD_REQUEST);
    }

    return this.firestore.acceptInvitation(token, userId);
  }

  async declineInvitation(token: string) {
    const invitation = await this.firestore.getInvitationByToken(token);
    if (!invitation) {
      throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new HttpException('Invitation is no longer valid', HttpStatus.BAD_REQUEST);
    }

    return this.firestore.declineInvitation(token);
  }
}
