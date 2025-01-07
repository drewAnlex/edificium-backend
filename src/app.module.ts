import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsModule } from './buildings/buildings.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

import { environment } from './environments';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';
import { ReportsModule } from './reports/reports.module';
import { CurrencyModule } from './currency/currency.module';
import config from './config';
import { ScheduleModule } from '@nestjs/schedule';
import { FundModule } from './fund/fund.module';
import { BotsModule } from './bots/bots.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: environment[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BuildingsModule,
    UsersModule,
    PaymentsModule,
    PaymentMethodModule,
    DatabaseModule,
    AuthModule,
    MailingModule,
    ReportsModule,
    CurrencyModule,
    FundModule,
    BotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
