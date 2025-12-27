import { Injectable } from '@nestjs/common';
import { Firestore, CollectionReference } from '@google-cloud/firestore';
import {
  IExpenseRepository,
  Expense,
  CreateExpenseDto,
  ExpenseFilters,
  ExpenseStats,
  Category,
  SubCategory,
} from './database.interface';

@Injectable()
export class FirestoreRepository implements IExpenseRepository {
  private db: Firestore;
  private expenses: CollectionReference;
  private categories: CollectionReference;
  private subCategories: CollectionReference;
  private groups: CollectionReference;

  constructor() {
    // Initialize Firestore
    this.db = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // credentials will be auto-loaded from GOOGLE_APPLICATION_CREDENTIALS env var
    });

    this.expenses = this.db.collection('expenses');
    this.categories = this.db.collection('categories');
    this.subCategories = this.db.collection('sub_categories');
    this.groups = this.db.collection('groups');
  }

  async create(userId: number | string, expenseDto: CreateExpenseDto): Promise<Expense> {
    const expenseData = {
      ...expenseDto,
      userId: String(userId),
      amount:
        typeof expenseDto.amount === 'string' ? parseFloat(expenseDto.amount) : expenseDto.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await this.expenses.add(expenseData);
    return {
      id: docRef.id,
      ...expenseData,
    };
  }

  async findAll(userId: number | string, filters?: ExpenseFilters): Promise<Expense[]> {
    let query: any = this.expenses.where('userId', '==', String(userId));

    if (filters?.startDate && filters?.endDate) {
      // Convert Date objects to YYYY-MM-DD string format for comparison
      const startDateStr =
        filters.startDate instanceof Date
          ? filters.startDate.toISOString().split('T')[0]
          : filters.startDate;
      const endDateStr =
        filters.endDate instanceof Date
          ? filters.endDate.toISOString().split('T')[0]
          : filters.endDate;
      query = query.where('date', '>=', startDateStr).where('date', '<=', endDateStr);
    }

    if (filters?.categoryId) {
      query = query.where('categoryId', '==', filters.categoryId);
    }

    if (filters?.minAmount) {
      query = query.where('amount', '>=', filters.minAmount);
    }

    if (filters?.maxAmount) {
      query = query.where('amount', '<=', filters.maxAmount);
    }

    // Try with orderBy, but catch index errors and retry without it
    try {
      const snapshot = await query.orderBy('date', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      // If index is missing, fetch without orderBy and sort in memory
      if (error.code === 9) {
        console.log('Index not available, sorting in memory');
        const snapshot = await query.get();
        const docs = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by date descending in memory
        return docs.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
      }
      throw error;
    }
  }

  async findOne(id: string | number, userId: number | string): Promise<Expense | null> {
    const doc = await this.expenses.doc(String(id)).get();

    if (!doc.exists) {
      return null;
    }

    const data: any = doc.data();

    // Verify ownership
    if (data.userId !== String(userId)) {
      return null;
    }

    return {
      id: doc.id,
      ...data,
    };
  }

  async update(
    id: string | number,
    userId: number | string,
    expenseDto: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    const expense = await this.findOne(id, userId);

    if (!expense) {
      throw new Error('Expense not found');
    }

    const updateData: any = {
      ...expenseDto,
      updatedAt: new Date().toISOString(),
    };

    if (expenseDto.amount) {
      updateData.amount =
        typeof expenseDto.amount === 'string' ? parseFloat(expenseDto.amount) : expenseDto.amount;
    }

    await this.expenses.doc(String(id)).update(updateData);

    return {
      ...expense,
      ...updateData,
    };
  }

  async delete(id: string | number, userId: number | string): Promise<void> {
    const expense = await this.findOne(id, userId);

    if (!expense) {
      throw new Error('Expense not found');
    }

    await this.expenses.doc(String(id)).delete();
  }

  async getStats(userId: number | string, filters?: ExpenseFilters): Promise<ExpenseStats> {
    const expenses = await this.findAll(userId, filters);
    console.log(`[STATS] Found ${expenses.length} expenses for user ${userId}`, {
      filters,
      expenses: expenses.map((e) => ({
        id: e.id,
        amount: e.amount,
        categoryId: e.categoryId,
        date: e.date,
      })),
    });

    const total = expenses.reduce((sum, exp) => {
      const amount = typeof exp.amount === 'string' ? parseFloat(exp.amount) : exp.amount;
      return sum + amount;
    }, 0);

    // Group by category
    const categoryMap = new Map<number, number>();

    for (const expense of expenses) {
      const categoryId = expense.categoryId;
      const amount =
        typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      categoryMap.set(categoryId, (categoryMap.get(categoryId) || 0) + amount);
    }

    // Return category data with categoryId for frontend to resolve names
    const byCategory = Array.from(categoryMap.entries()).map(([categoryId, total]) => {
      return {
        categoryId,
        total,
      };
    });

    const result = {
      total,
      count: expenses.length,
      byCategory,
      byMonth: [], // Implement if needed
    };
    console.log('[STATS] Returning stats:', result);
    return result;
  }

  async getCategories(): Promise<Category[]> {
    const snapshot = await this.categories.get();

    return snapshot.docs.map((doc: any) => ({
      id: parseInt(doc.id),
      ...doc.data(),
    }));
  }

  async getSubCategories(categoryId: number): Promise<SubCategory[]> {
    const snapshot = await this.subCategories.where('categoryId', '==', categoryId).get();

    return snapshot.docs.map((doc: any) => ({
      id: parseInt(doc.id),
      ...doc.data(),
    }));
  }

  // Find group by userId
  async findGroupByUserId(userId: string): Promise<any> {
    // Assumes groups collection has a 'members' array field with userIds
    const snapshot = await this.groups.where('members', 'array-contains', userId).get();
    if (snapshot.empty) {
      return null;
    }
    // Return the first group found
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Find group by ID
  async findGroupById(groupId: string): Promise<any> {
    const doc = await this.groups.doc(groupId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  // Create default group for a user
  async createDefaultGroup(userId: string): Promise<any> {
    const groupData = {
      name: 'My Expenses',
      ownerId: userId,
      members: [userId],
      memberDetails: [
        {
          id: userId,
          role: 'owner',
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await this.groups.add(groupData);
    return { id: docRef.id, ...groupData };
  }

  // Get group members with details
  async getGroupMembers(groupId: string): Promise<any[]> {
    const group = await this.findGroupById(groupId);
    if (!group) {
      return [];
    }

    // Return memberDetails if available, otherwise construct from members array
    if (group.memberDetails && Array.isArray(group.memberDetails)) {
      return group.memberDetails;
    }

    // Fallback: construct basic member info from members array
    return (group.members || []).map((memberId: string) => ({
      id: memberId,
      role: memberId === group.ownerId ? 'owner' : 'member',
    }));
  }

  // Update member role
  async updateMemberRole(groupId: string, memberId: string, role: string): Promise<any> {
    const group = await this.findGroupById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const memberDetails = group.memberDetails || [];
    const memberIndex = memberDetails.findIndex((m: any) => m.id === memberId);

    if (memberIndex === -1) {
      throw new Error('Member not found in group');
    }

    memberDetails[memberIndex].role = role;

    await this.groups.doc(groupId).update({
      memberDetails,
      updatedAt: new Date().toISOString(),
    });

    return { message: 'Role updated successfully' };
  }

  // Remove member from group
  async removeMemberFromGroup(groupId: string, memberId: string): Promise<any> {
    const group = await this.findGroupById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const members = (group.members || []).filter((id: string) => id !== memberId);
    const memberDetails = (group.memberDetails || []).filter((m: any) => m.id !== memberId);

    await this.groups.doc(groupId).update({
      members,
      memberDetails,
      updatedAt: new Date().toISOString(),
    });

    return { message: 'Member removed successfully' };
  }

  // Invitations methods
  private get invitationsCollection(): CollectionReference {
    return this.db.collection('invitations');
  }

  async getInvitationsByGroupId(groupId: string): Promise<any[]> {
    const snapshot = await this.invitationsCollection
      .where('groupId', '==', groupId)
      .where('status', '==', 'pending')
      .get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async createInvitation(data: {
    groupId: string;
    email: string;
    invitedBy: string;
    role?: string;
  }): Promise<any> {
    const token = this.generateToken();
    const invitationData = {
      ...data,
      token,
      role: data.role || 'member',
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const docRef = await this.invitationsCollection.add(invitationData);
    return { id: docRef.id, ...invitationData };
  }

  async getInvitationByToken(token: string): Promise<any> {
    const snapshot = await this.invitationsCollection.where('token', '==', token).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async acceptInvitation(token: string, userId: string): Promise<any> {
    const invitation = await this.getInvitationByToken(token);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    // Update invitation status
    await this.invitationsCollection.doc(invitation.id).update({
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      acceptedBy: userId,
    });

    // Add user to group
    const group = await this.findGroupById(invitation.groupId);
    if (group) {
      const members = [...(group.members || []), userId];
      const memberDetails = [
        ...(group.memberDetails || []),
        {
          id: userId,
          role: invitation.role || 'member',
          joinedAt: new Date().toISOString(),
        },
      ];

      await this.groups.doc(invitation.groupId).update({
        members,
        memberDetails,
        updatedAt: new Date().toISOString(),
      });
    }

    return { message: 'Invitation accepted' };
  }

  async declineInvitation(token: string): Promise<any> {
    const invitation = await this.getInvitationByToken(token);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    await this.invitationsCollection.doc(invitation.id).update({
      status: 'declined',
      declinedAt: new Date().toISOString(),
    });

    return { message: 'Invitation declined' };
  }

  private generateToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}
