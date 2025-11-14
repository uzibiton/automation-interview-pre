import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Category } from '../expenses/category.entity';
import {
  IExpenseRepository,
  CreateExpenseDto,
  ExpenseFilters,
  ExpenseStats,
  SubCategory,
} from './database.interface';

@Injectable()
export class PostgresRepository implements IExpenseRepository {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(userId: number | string, expenseDto: CreateExpenseDto): Promise<any> {
    const expense = this.expenseRepository.create({
      ...expenseDto,
      userId: Number(userId),
      amount:
        typeof expenseDto.amount === 'string' ? parseFloat(expenseDto.amount) : expenseDto.amount,
    });
    return await this.expenseRepository.save(expense);
  }

  async findAll(userId: number | string, filters?: ExpenseFilters): Promise<any[]> {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId: Number(userId) });

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters?.categoryId) {
      query.andWhere('expense.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.minAmount) {
      query.andWhere('expense.amount >= :minAmount', { minAmount: filters.minAmount });
    }

    if (filters?.maxAmount) {
      query.andWhere('expense.amount <= :maxAmount', { maxAmount: filters.maxAmount });
    }

    return await query.orderBy('expense.date', 'DESC').getMany();
  }

  async findOne(id: string | number, userId: number | string): Promise<any | null> {
    return await this.expenseRepository.findOne({
      where: { id: Number(id), userId: Number(userId) },
    });
  }

  async update(
    id: string | number,
    userId: number | string,
    expenseDto: Partial<CreateExpenseDto>,
  ): Promise<any> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    Object.assign(expense, expenseDto);
    if (expenseDto.amount) {
      expense.amount =
        typeof expenseDto.amount === 'string' ? parseFloat(expenseDto.amount) : expenseDto.amount;
    }

    return await this.expenseRepository.save(expense);
  }

  async delete(id: string | number, userId: number | string): Promise<void> {
    await this.expenseRepository.delete({ id: Number(id), userId: Number(userId) });
  }

  async getStats(userId: number | string, filters?: ExpenseFilters): Promise<ExpenseStats> {
    const expenses = await this.findAll(userId, filters);

    const total = expenses.reduce((sum, exp) => {
      const amount = typeof exp.amount === 'string' ? parseFloat(exp.amount) : exp.amount;
      return sum + amount;
    }, 0);

    const by_category = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('category.nameEn', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .leftJoin(Category, 'category', 'category.id = expense.categoryId')
      .where('expense.userId = :userId', { userId: Number(userId) })
      .groupBy('category.nameEn')
      .getRawMany();

    return {
      total,
      count: expenses.length,
      by_category: by_category.map((item) => ({
        category: item.category,
        total: parseFloat(item.total),
      })),
      by_month: [], // Implement if needed
    };
  }

  async getCategories(): Promise<any[]> {
    return await this.categoryRepository.find();
  }

  async getSubCategories(categoryId: number): Promise<SubCategory[]> {
    // Implement based on your sub_categories table
    return [];
  }
}
