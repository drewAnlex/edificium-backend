import { forwardRef, Module } from '@nestjs/common';
import { PaymentMethodsService } from './services/payment-methods.service';
import { PaymentMethodsController } from './controllers/payment-methods.controller';
import { PaymentMethodListService } from './services/payment-method-list.service';
import { PaymentMethodListController } from './controllers/payment-method-list.controller';
import { PaymentMethodDetailsService } from './services/payment-method-details.service';
import { PaymentMethodDetailsController } from './controllers/payment-method-details.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/PaymentMethod.entity';
import { PaymentMethodList } from './entities/payment-method-list.entity';
import { PaymentMethodDetails } from './entities/payment-method-details.entity';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { OutboundService } from 'src/mailing/services/outbound.service';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { UsersService } from 'src/users/services/users.service';
import { Apartment } from 'src/buildings/entities/apartment.entity';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { User } from 'src/users/entities/User.entity';
import { Building } from 'src/buildings/entities/building.entity';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { PaymentMethodFieldsService } from './services/payment-method-fields.service';
import { PaymentMethodFields } from './entities/payment-method-fields.entity';
import { PaymentMethodFieldsController } from './controllers/payment-method-fields.controller';
import { ReportsModule } from 'src/reports/reports.module';
import { BillingService } from 'src/reports/services/billing.service';
import { CurrencyModule } from 'src/currency/currency.module';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';
import { currencyValuePerDay } from 'src/currency/entities/currency-value-per-day.entity';
import { Role } from 'src/users/entities/Role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
      PaymentMethodList,
      PaymentMethodDetails,
      Building,
      Apartment,
      BuildingBill,
      IndividualBill,
      Expense,
      User,
      Role,
      PaymentMethodFields,
      currencyValuePerDay,
    ]),
    PaymentMethodModule,
    forwardRef(() => ReportsModule),
    forwardRef(() => CurrencyModule),
  ],
  controllers: [
    PaymentMethodsController,
    PaymentMethodListController,
    PaymentMethodDetailsController,
    PaymentMethodFieldsController,
  ],
  providers: [
    PaymentMethodsService,
    PaymentMethodListService,
    PaymentMethodDetailsService,
    BuildingBillsService,
    IndividualBillsService,
    UsersService,
    ApartmentsService,
    OutboundService,
    BuildingsService,
    PaymentMethodFieldsService,
    BillingService,
    CurrencyValuePerDayService,
  ],
})
export class PaymentMethodModule {}
