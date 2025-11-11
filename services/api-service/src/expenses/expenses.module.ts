import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category, SubCategory]), HttpModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, AuthGuard],
})
export class ExpensesModule {}
