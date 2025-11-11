import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

// Only import TypeORM entities if using PostgreSQL
const databaseImports =
  process.env.DATABASE_TYPE === 'firestore' ? [] : [TypeOrmModule.forFeature([User])];

@Module({
  imports: [...databaseImports],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
