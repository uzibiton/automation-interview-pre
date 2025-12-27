import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ExpensesModule } from './expenses/expenses.module';
import { GroupsModule } from './groups/groups.module';
import { InvitationsModule } from './invitations/invitations.module';

// Database configuration - only for PostgreSQL
const databaseConfig =
  process.env.DATABASE_TYPE === 'firestore'
    ? []
    : [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.POSTGRES_USER || 'testuser',
          password: process.env.POSTGRES_PASSWORD || 'testpass',
          database: process.env.POSTGRES_DB || 'testdb',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
        }),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ...databaseConfig,
    HttpModule,
    ExpensesModule,
    GroupsModule,
    InvitationsModule,
  ],
})
export class AppModule {}
