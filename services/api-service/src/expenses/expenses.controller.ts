import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async getExpenses(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters = {
      startDate,
      endDate,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    };

    return this.expensesService.findAll(req.user.id, filters);
  }

  @Get('stats')
  async getStats(@Req() req, @Query('period') period?: string) {
    return this.expensesService.getStats(req.user.id, period);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.expensesService.getCategories(lang);
  }

  @Get('categories/:categoryId/subcategories')
  async getSubCategories(@Param('categoryId') categoryId: string) {
    return this.expensesService.getSubCategories(parseInt(categoryId));
  }

  @Get(':id')
  async getExpense(@Req() req, @Param('id') id: string) {
    return this.expensesService.findOne(req.user.id, parseInt(id));
  }

  @Post()
  async createExpense(@Req() req, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(req.user.id, createExpenseDto);
  }

  @Put(':id')
  async updateExpense(
    @Req() req,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(req.user.id, parseInt(id), updateExpenseDto);
  }

  @Delete(':id')
  async deleteExpense(@Req() req, @Param('id') id: string) {
    await this.expensesService.delete(req.user.id, parseInt(id));
    return { message: 'Expense deleted successfully' };
  }
}
