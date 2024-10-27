import { forwardRef, Module } from '@nestjs/common';
import { MailingModule } from '../mailing/mailing.module';
import { OutboundService } from '../mailing/services/outbound.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Role } from './entities/Role.entity';
import { User } from './entities/User.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './controllers/profile.controller';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { BillingService } from 'src/reports/services/billing.service';
import { ReportsModule } from 'src/reports/reports.module';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { Building } from 'src/buildings/entities/building.entity';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { PaymentMethodDetailsService } from 'src/payment-method/services/payment-method-details.service';
import { PaymentMethodDetails } from 'src/payment-method/entities/payment-method-details.entity';
import { currencyValuePerDay } from 'src/currency/entities/currency-value-per-day.entity';
import { CurrencyModule } from 'src/currency/currency.module';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';

@Module({
  imports: [
    forwardRef(() => MailingModule),
    PaymentsModule,
    forwardRef(() => ReportsModule),
    forwardRef(() => PaymentMethodModule),
    forwardRef(() => BuildingsModule),
    forwardRef(() => CurrencyModule),
    TypeOrmModule.forFeature([
      Role,
      User,
      BuildingBill,
      IndividualBill,
      Building,
      PaymentMethodList,
      PaymentMethodDetails,
      currencyValuePerDay,
    ]),
  ],
  controllers: [UsersController, RolesController, ProfileController],
  providers: [
    PaymentMethodListService,
    PaymentMethodDetailsService,
    UsersService,
    RolesService,
    OutboundService,
    BuildingBillsService,
    IndividualBillsService,
    BillingService,
    BuildingsService,
    CurrencyValuePerDayService,
  ],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
