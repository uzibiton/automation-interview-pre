import { IsNumber, IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class ParseExpenseDto {
  @IsString()
  text: string;
}

export class CreateExpenseDto {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  @IsOptional()
  subCategoryId?: number;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsString()
  paymentMethod: string;

  @IsArray()
  @IsOptional()
  labels?: string[];
}

export class UpdateExpenseDto {
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  subCategoryId?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsArray()
  @IsOptional()
  labels?: string[];
}
