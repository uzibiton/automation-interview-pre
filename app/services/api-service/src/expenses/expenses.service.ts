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

  async findOne(userId: number, id: string | number): Promise<Expense> {
    if (this.useFirestore) {
      return this.firestoreRepo.findOne(id, userId) as any;
    }

    const expense = await this.expensesRepository.findOne({
      where: { id: typeof id === 'string' ? parseInt(id) : id, userId },
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

  async update(userId: number, id: string | number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    if (this.useFirestore) {
      return this.firestoreRepo.update(id, userId, updateExpenseDto) as any;
    }

    const expense = await this.findOne(userId, id);

    Object.assign(expense, updateExpenseDto);

    return this.expensesRepository.save(expense);
  }

  async delete(userId: number, id: string | number): Promise<void> {
    if (this.useFirestore) {
      return this.firestoreRepo.delete(id, userId);
    }

    const expense = await this.findOne(userId, id);
    await this.expensesRepository.remove(expense);
  }

  async getStats(userId: number, period: string = 'month'): Promise<any> {
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

    if (this.useFirestore) {
      return this.firestoreRepo.getStats(userId, { startDate, endDate: now });
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

  async parseExpense(text: string): Promise<any> {
    // Rule-based parsing for natural language expense input
    const result: any = {
      amount: null,
      currency: 'USD',
      categoryId: null,
      description: text,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'credit_card',
      confidence: 0.7,
    };

    // Extract amount
    const amountPatterns = [
      /\$(\d+\.?\d*)/i, // $30, $30.50
      /(\d+\.?\d*)\s*(?:dollars?|usd)/i, // 30 dollars, 30.50 USD
      /(\d+\.?\d*)\s*(?:₪|nis|ils|shekel)/i, // 30 NIS, 30₪
      /(\d+\.?\d*)\s*(?:€|eur|euro)/i, // 30 EUR, 30€
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        result.amount = parseFloat(match[1]);
        break;
      }
    }

    // Extract currency
    if (/₪|nis|ils|shekel/i.test(text)) {
      result.currency = 'ILS';
    } else if (/€|eur|euro/i.test(text)) {
      result.currency = 'EUR';
    } else if (/\$|dollars?|usd/i.test(text)) {
      result.currency = 'USD';
    }

    // Extract category based on keywords
    const categoryKeywords: { [key: string]: number } = {
      'food|groceries|supermarket|restaurant|lunch|dinner|breakfast|coffee|meal': 1, // Food & Dining
      'transport|taxi|uber|bus|train|gas|fuel|parking': 2, // Transportation
      'shopping|clothes|clothing|shoes|fashion': 3, // Shopping
      'entertainment|movie|cinema|concert|game|netflix|spotify': 4, // Entertainment
      'health|medical|doctor|pharmacy|medicine|hospital': 5, // Healthcare
      'education|school|course|book|tuition': 6, // Education
      'travel|hotel|flight|vacation|holiday': 7, // Travel
      'utility|utilities|electric|water|gas|internet|phone': 8, // Utilities
      'insurance': 9, // Insurance
      'other': 10, // Other
    };

    for (const [keywords, categoryId] of Object.entries(categoryKeywords)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(text)) {
        result.categoryId = categoryId;
        break;
      }
    }

    // Default to "Other" category if no match found
    if (!result.categoryId) {
      result.categoryId = 1; // Default to Food & Dining as it's most common
    }

    // Extract date - currently only handles 'yesterday', more patterns can be added
    if (/yesterday/i.test(text)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      result.date = yesterday.toISOString().split('T')[0];
    }

    // Extract payment method
    if (/cash/i.test(text)) {
      result.paymentMethod = 'cash';
    } else if (/debit/i.test(text)) {
      result.paymentMethod = 'debit_card';
    } else if (/bank transfer|transfer/i.test(text)) {
      result.paymentMethod = 'bank_transfer';
    } else if (/credit|card/i.test(text)) {
      result.paymentMethod = 'credit_card';
    }

    // Adjust confidence based on what we found
    if (result.amount) result.confidence += 0.2;
    if (result.categoryId) result.confidence += 0.1;
    result.confidence = Math.min(result.confidence, 1.0);

    return result;
  }
}
