// Database Repository Interface
// Allows switching between PostgreSQL, Firestore, etc.

export interface Expense {
  id?: string | number;
  userId: number | string;
  amount: number | string;
  categoryId: number;
  subCategoryId?: number;
  currency: string;
  date: Date | string;
  paymentMethod: string;
  description?: string;
  labels?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateExpenseDto {
  amount: number | string;
  categoryId: number;
  subCategoryId?: number;
  currency: string;
  date: Date | string;
  paymentMethod: string;
  description?: string;
  labels?: string[];
}

export interface ExpenseStats {
  total: number;
  count: number;
  byCategory: { categoryId: number; total: number }[];
  byMonth: { month: string; total: number }[];
}

export interface Category {
  id: number;
  nameEn: string;
  nameHe: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  createdAt?: Date | string;
}

export interface SubCategory {
  id: number;
  categoryId: number;
  nameEn: string;
  nameHe: string;
}

export interface ExpenseFilters {
  startDate?: Date | string;
  endDate?: Date | string;
  categoryId?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface IExpenseRepository {
  // Expense CRUD
  create(userId: number | string, expense: CreateExpenseDto): Promise<Expense>;
  findAll(userId: number | string, filters?: ExpenseFilters): Promise<Expense[]>;
  findOne(id: string | number, userId: number | string): Promise<Expense | null>;
  update(
    id: string | number,
    userId: number | string,
    expense: Partial<CreateExpenseDto>,
  ): Promise<Expense>;
  delete(id: string | number, userId: number | string): Promise<void>;

  // Stats
  getStats(userId: number | string, filters?: ExpenseFilters): Promise<ExpenseStats>;

  // Categories
  getCategories(): Promise<Category[]>;
  getSubCategories(categoryId: number): Promise<SubCategory[]>;
}
