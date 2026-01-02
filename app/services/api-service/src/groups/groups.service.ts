import { Injectable, HttpException, HttpStatus, Optional } from '@nestjs/common';
import { FirestoreRepository } from '../database/firestore.repository';

@Injectable()
export class GroupsService {
  private useFirestore: boolean;

  constructor(@Optional() private readonly firestore: FirestoreRepository) {
    this.useFirestore = process.env.DATABASE_TYPE === 'firestore';
  }

  private checkFirestoreRequired() {
    if (!this.useFirestore) {
      throw new HttpException(
        'Groups feature requires Firestore. Not available in PostgreSQL mode.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getCurrentGroupForUser(userId: string) {
    this.checkFirestoreRequired();

    console.log('[GroupsService] getCurrentGroupForUser called with userId:', userId);
    // Query Firestore for the group associated with the user
    let group = await this.firestore.findGroupByUserId(userId);
    console.log('[GroupsService] findGroupByUserId result:', group ? `Found: ${group.id}` : 'null');

    // If no group exists, create a default group for the user
    if (!group) {
      group = await this.firestore.createDefaultGroup(userId);
    }

    return group;
  }

  async getGroupMembers(groupId: string, requestingUserId: string) {
    this.checkFirestoreRequired();

    // Verify the requesting user is a member of the group
    const group = await this.firestore.findGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (!group.members?.includes(requestingUserId)) {
      throw new HttpException('Not authorized to view this group', HttpStatus.FORBIDDEN);
    }

    return this.firestore.getGroupMembers(groupId);
  }

  async updateMemberRole(
    groupId: string,
    memberId: string,
    role: string,
    requestingUserId: string,
  ) {
    this.checkFirestoreRequired();

    // Verify the requesting user is an admin/owner of the group
    const group = await this.firestore.findGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const isOwner = group.ownerId === requestingUserId;
    if (!isOwner) {
      throw new HttpException('Only the owner can change roles', HttpStatus.FORBIDDEN);
    }

    return this.firestore.updateMemberRole(groupId, memberId, role);
  }

  async removeMember(groupId: string, memberId: string, requestingUserId: string) {
    this.checkFirestoreRequired();

    const group = await this.firestore.findGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const isOwner = group.ownerId === requestingUserId;
    const isSelf = memberId === requestingUserId;

    if (!isOwner && !isSelf) {
      throw new HttpException('Not authorized to remove this member', HttpStatus.FORBIDDEN);
    }

    if (isOwner && isSelf) {
      throw new HttpException('Owner cannot remove themselves', HttpStatus.BAD_REQUEST);
    }

    return this.firestore.removeMemberFromGroup(groupId, memberId);
  }
}
