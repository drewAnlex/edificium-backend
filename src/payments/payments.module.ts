import { forwardRef, Module } from '@nestjs/common';
import { BuildingBillsService } from './services/building-bills.service';
import { IndividualBillsService } from './services/individual-bills.service';
import { IndividualBillsController } from './controllers/individual-bills.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentInfoService } from './services/payment-info.service';
import { PaymentInfoController } from './controllers/payment-info.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingBill } from './entities/BuildingBill.entity';
import { BuildingBillsController } from './controllers/building-bills.controller';
import { IndividualBill } from './entities/IndividualBill.entity';
import { Apartment } from '../buildings/entities/apartment.entity';
import { Payment } from './entities/Payment.entity';
import { PaymentInfo } from './entities/payment-info.entity';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { MyBuildingBillsController } from './controllers/my-building-bills.controller';
import { Expense } from './entities/Expense.entity';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { MailingModule } from 'src/mailing/mailing.module';
import { OutboundService } from 'src/mailing/services/outbound.service';
import { Building } from 'src/buildings/entities/building.entity';
import { BillingService } from 'src/reports/services/billing.service';
import { ReportsModule } from 'src/reports/reports.module';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/User.entity';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { PaymentMethodDetails } from 'src/payment-method/entities/payment-method-details.entity';
import { PaymentMethodDetailsService } from 'src/payment-method/services/payment-method-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Building,
      Apartment,
      BuildingBill,
      IndividualBill,
      Payment,
      PaymentInfo,
      Expense,
      User,
      PaymentMethodList,
      PaymentMethodDetails,
    ]),
    forwardRef(() => BuildingsModule),
    forwardRef(() => MailingModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentMethodModule),
  ],
  providers: [
    PaymentMethodListService,
    PaymentMethodDetailsService,
    BuildingBillsService,
    IndividualBillsService,
    PaymentsService,
    PaymentInfoService,
    ExpenseService,
    BillingService,
    OutboundService,
    UsersService,
  ],
  controllers: [
    BuildingBillsController,
    IndividualBillsController,
    PaymentsController,
    PaymentInfoController,
    MyBuildingBillsController,
    ExpenseController,
  ],
})
export class PaymentsModule {}
