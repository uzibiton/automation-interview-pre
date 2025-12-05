import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
          synchronize: false, // Use migrations in production
          logging: process.env.NODE_ENV === 'development',
        }),
      ];

@Module({
  imports: [
    ...databaseConfig,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
