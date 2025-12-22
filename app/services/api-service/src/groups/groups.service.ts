import { Injectable } from '@nestjs/common';
import { FirestoreRepository } from '../database/firestore.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly firestore: FirestoreRepository) {}

  async getCurrentGroupForUser(userId: string) {
    // Query Firestore for the group associated with the user
    const group = await this.firestore.findGroupByUserId(userId);
    if (!group) {
      return { error: 'Group not found for user' };
    }
    return group;
  }
}
