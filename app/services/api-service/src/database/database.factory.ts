import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from './database.interface';
import { PostgresRepository } from './postgres.repository';
import { FirestoreRepository } from './firestore.repository';

export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  FIRESTORE = 'firestore',
}

@Injectable()
export class DatabaseFactory {
  static createRepository(type: DatabaseType): IExpenseRepository {
    switch (type) {
      case DatabaseType.POSTGRESQL:
        return new PostgresRepository(null, null); // Will be injected properly
      case DatabaseType.FIRESTORE:
        return new FirestoreRepository();
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }

  static getRepositoryType(): DatabaseType {
    const dbType = process.env.DATABASE_TYPE || 'postgresql';
    return dbType as DatabaseType;
  }
}
