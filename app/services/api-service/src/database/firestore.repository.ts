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

  constructor() {
    // Initialize Firestore
    this.db = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // credentials will be auto-loaded from GOOGLE_APPLICATION_CREDENTIALS env var
    });

    this.expenses = this.db.collection('expenses');
    this.categories = this.db.collection('categories');
    this.subCategories = this.db.collection('sub_categories');
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
}
