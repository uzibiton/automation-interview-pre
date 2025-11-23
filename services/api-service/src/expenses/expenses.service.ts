import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { FirestoreRepository } from '../database/firestore.repository';

@Injectable()
export class ExpensesService {
  private firestoreRepo: FirestoreRepository;
  private useFirestore: boolean;

  constructor(
    @Optional()
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @Optional()
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Optional()
    @InjectRepository(SubCategory)
    private subCategoriesRepository: Repository<SubCategory>,
  ) {
    this.useFirestore = process.env.DATABASE_TYPE === 'firestore';
    if (this.useFirestore) {
      this.firestoreRepo = new FirestoreRepository();
    }
  }

  async findAll(
    userId: number,
    filters?: { startDate?: string; endDate?: string; categoryId?: number },
  ): Promise<Expense[]> {
    if (this.useFirestore) {
      return this.firestoreRepo.findAll(userId, filters) as any;
    }

    const query = this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .orderBy('expense.date', 'DESC');

    if (filters?.startDate) {
      query.andWhere('expense.date >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('expense.date <= :endDate', { endDate: filters.endDate });
    }

    if (filters?.categoryId) {
      query.andWhere('expense.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    return query.getMany();
  }

  async findOne(userId: number, id: number): Promise<Expense> {
    if (this.useFirestore) {
      return this.firestoreRepo.findOne(userId, id) as any;
    }

    const expense = await this.expensesRepository.findOne({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async create(userId: number, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    if (this.useFirestore) {
      return this.firestoreRepo.create(userId, createExpenseDto) as any;
    }

    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
    });

    return this.expensesRepository.save(expense);
  }

  async update(userId: number, id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    if (this.useFirestore) {
      return this.firestoreRepo.update(userId, id, updateExpenseDto) as any;
    }

    const expense = await this.findOne(userId, id);

    Object.assign(expense, updateExpenseDto);

    return this.expensesRepository.save(expense);
  }

  async delete(userId: number, id: number): Promise<void> {
    if (this.useFirestore) {
      return this.firestoreRepo.delete(userId, id);
    }

    const expense = await this.findOne(userId, id);
    await this.expensesRepository.remove(expense);
  }

  async getStats(userId: number, period: string = 'month'): Promise<any> {
    if (this.useFirestore) {
      return this.firestoreRepo.getStats(userId, period);
    }

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const expenses = await this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date >= :startDate', { startDate })
      .getMany();

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const byCategory = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('expense.categoryId', 'categoryId')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date >= :startDate', { startDate })
      .groupBy('expense.categoryId')
      .getRawMany();

    return {
      total,
      count: expenses.length,
      period,
      byCategory,
    };
  }

  async getCategories(language: string = 'en'): Promise<Category[]> {
    if (this.useFirestore) {
      return this.firestoreRepo.getCategories() as any;
    }
    return this.categoriesRepository.find({
      order: { nameEn: 'ASC' },
    });
  }

  async getSubCategories(categoryId: number): Promise<SubCategory[]> {
    if (this.useFirestore) {
      return this.firestoreRepo.getSubCategories(categoryId) as any;
    }
    return this.subCategoriesRepository.find({
      where: { categoryId },
      order: { nameEn: 'ASC' },
    });
  }
}
