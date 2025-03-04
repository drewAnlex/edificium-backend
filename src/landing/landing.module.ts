import { Module } from '@nestjs/common';
import { QuotesController } from './controllers/quotes.controller';
import { QuotesService } from './services/quotes.service';
import { Quote } from './entities/Quote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboundService } from 'src/mailing/services/outbound.service';
import { MailingModule } from 'src/mailing/mailing.module';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { BillingService } from 'src/reports/services/billing.service';
import { UsersService } from 'src/users/services/users.service';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';
import { User } from 'src/users/entities/User.entity';
import { Building } from 'src/buildings/entities/building.entity';
import { Apartment } from 'src/buildings/entities/apartment.entity';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { currencyValuePerDay } from 'src/currency/entities/currency-value-per-day.entity';
import { Role } from 'src/users/entities/Role.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { ExpenseService } from 'src/payments/services/expense.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quote,
      BuildingBill,
      IndividualBill,
      User,
      Role,
      Building,
      Apartment,
      PaymentMethodList,
      currencyValuePerDay,
      Expense,
    ]),
    MailingModule,
    PaymentsModule,
  ],
  controllers: [QuotesController],
  providers: [
    QuotesService,
    OutboundService,
    BuildingBillsService,
    IndividualBillsService,
    BillingService,
    UsersService,
    BuildingsService,
    ApartmentsService,
    PaymentMethodListService,
    CurrencyValuePerDayService,
    ExpenseService,
  ],
})
export class LandingModule {}
