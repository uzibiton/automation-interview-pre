import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Only load TypeORM if not using Firestore
    ...(process.env.DATABASE_TYPE === 'firestore'
      ? []
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 5432),
              username: configService.get('POSTGRES_USER', 'testuser'),
              password: configService.get('POSTGRES_PASSWORD', 'testpass'),
              database: configService.get('POSTGRES_DB', 'testdb'),
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: false,
              logging: configService.get('NODE_ENV') === 'development',
            }),
          }),
        ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
