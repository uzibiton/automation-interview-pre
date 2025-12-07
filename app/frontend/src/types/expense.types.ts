/**
 * Common expense-related type definitions
 */

export interface Category {
  id: number;
  nameEn: string;
  nameHe: string;
  icon: string;
  color: string;
}

export interface SubCategory {
  id: number;
  categoryId: number;
  nameEn: string;
  nameHe: string;
}

export interface Expense {
  id: number;
  categoryId: number;
  subCategoryId?: number;
  amount: string | number;
  currency: string;
  description: string;
  date: string;
  paymentMethod: string;
  /** Optional array of label/tag strings for categorizing expenses */
  labels?: string[];
}
