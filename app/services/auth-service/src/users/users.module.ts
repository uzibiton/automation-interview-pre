import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { FirestoreUsersService } from './firestore-users.service';

// Only import TypeORM entities if using PostgreSQL
const databaseImports =
  process.env.DATABASE_TYPE === 'firestore' ? [] : [TypeOrmModule.forFeature([User])];

// Use FirestoreUsersService for Firestore, UsersService for PostgreSQL
const usersServiceProvider =
  process.env.DATABASE_TYPE === 'firestore'
    ? { provide: UsersService, useClass: FirestoreUsersService }
    : UsersService;

@Module({
  imports: [...databaseImports],
  providers: [usersServiceProvider],
  exports: [UsersService],
})
export class UsersModule {}
