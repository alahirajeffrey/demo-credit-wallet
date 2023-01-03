import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        useNullAsDefault: true,
        connection: {
          host: process.env.DEV_DB_HOST || '127.0.0.1',
          user: process.env.DEV_DB_USER || 'root',
          password: process.env.DEV_DB_PASSWORD || '102296',
          database: process.env.DEV_DB_DATABASE || 'demo-credit-wallet',
        },
      },
    }),
    AuthModule,
    AccountModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
