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
import { CreateExpenseDto, UpdateExpenseDto, ParseExpenseDto } from './dto/expense.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // Helper to get the correct user ID (Firestore doc ID)
  private getUserId(req: any): string {
    return req.user.userId || req.user.id;
  }

  @Get()
  async getExpenses(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('groupId') groupId?: string,
  ) {
    const filters = {
      startDate,
      endDate,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      groupId,
    };

    return this.expensesService.findAll(this.getUserId(req), filters);
  }

  @Get('stats')
  async getStats(@Req() req, @Query('period') period?: string) {
    return this.expensesService.getStats(this.getUserId(req), period);
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
    return this.expensesService.findOne(this.getUserId(req), id);
  }

  @Post('parse')
  async parseExpense(@Req() req, @Body() parseExpenseDto: ParseExpenseDto) {
    return this.expensesService.parseExpense(parseExpenseDto.text);
  }

  @Post()
  async createExpense(@Req() req, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(this.getUserId(req), createExpenseDto);
  }

  @Put(':id')
  async updateExpense(
    @Req() req,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(this.getUserId(req), id, updateExpenseDto);
  }

  @Delete(':id')
  async deleteExpense(@Req() req, @Param('id') id: string) {
    await this.expensesService.delete(this.getUserId(req), id);
    return { message: 'Expense deleted successfully' };
  }
}
