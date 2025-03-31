import { forwardRef, Module } from '@nestjs/common';
import { BillingService } from './services/billing.service';
import { BillingController } from './controllers/billing.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/buildings/entities/apartment.entity';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/User.entity';
import { OutboundService } from 'src/mailing/services/outbound.service';
import { MailingModule } from 'src/mailing/mailing.module';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { PaymentMethodDetailsService } from 'src/payment-method/services/payment-method-details.service';
import { PaymentMethodDetails } from 'src/payment-method/entities/payment-method-details.entity';
import { UsersModule } from 'src/users/users.module';
import { CurrencyModule } from 'src/currency/currency.module';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';
import { currencyValuePerDay } from 'src/currency/entities/currency-value-per-day.entity';
import { FundService } from './services/fund.service';
import { FundService as FService } from 'src/fund/services/fund.service';
import { FundModule } from 'src/fund/fund.module';
import { FundController } from './controllers/fund.controller';
import { Fund } from 'src/fund/entities/Fund.entity';
import { Role } from 'src/users/entities/Role.entity';
import { ExpenseService } from 'src/payments/services/expense.service';
import { AuditService } from './services/audit.service';
import { AuditController } from './controllers/audit.controller';
import { IndividualExpense } from 'src/payments/entities/IndividualExpense.entity';
import { IndividualExpensesService } from 'src/payments/services/individual-expenses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      BuildingBill,
      IndividualBill,
      Expense,
      IndividualExpense,
      User,
      Role,
      PaymentMethodList,
      PaymentMethodDetails,
      currencyValuePerDay,
      Fund,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => PaymentMethodModule),
    forwardRef(() => BuildingsModule),
    forwardRef(() => MailingModule),
    forwardRef(() => CurrencyModule),
    forwardRef(() => FundModule),
  ],
  providers: [
    UsersService,
    PaymentMethodListService,
    PaymentMethodDetailsService,
    BillingService,
    BuildingBillsService,
    IndividualBillsService,
    ApartmentsService,
    OutboundService,
    CurrencyValuePerDayService,
    FundService,
    FService,
    ExpenseService,
    IndividualExpensesService,
    AuditService,
  ],
  controllers: [BillingController, FundController, AuditController],
})
export class ReportsModule {}
