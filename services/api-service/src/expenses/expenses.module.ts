import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { AuthGuard } from '../guards/auth.guard';
import { SeedService } from './services/seed.service';

// Only import TypeORM entities if using PostgreSQL
const databaseImports =
  process.env.DATABASE_TYPE === 'firestore'
    ? []
    : [TypeOrmModule.forFeature([Expense, Category, SubCategory])];

// Only provide SeedService when using PostgreSQL (requires TypeORM repositories)
const databaseProviders = process.env.DATABASE_TYPE === 'firestore' ? [] : [SeedService];

@Module({
  imports: [...databaseImports, HttpModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, AuthGuard, ...databaseProviders],
})
export class ExpensesModule {}
