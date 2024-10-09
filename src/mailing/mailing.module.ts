import { forwardRef, Module } from '@nestjs/common';
import { OutboundService } from './services/outbound.service';
import { OutboundController } from './controllers/outbound.controller';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { BillingService } from 'src/reports/services/billing.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { ReportsModule } from 'src/reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/buildings/entities/apartment.entity';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { PaymentInfo } from 'src/payments/entities/payment-info.entity';
import { Payment } from 'src/payments/entities/Payment.entity';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { Building } from 'src/buildings/entities/building.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/User.entity';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { PaymentMethodDetails } from 'src/payment-method/entities/payment-method-details.entity';
import { PaymentMethodDetailsService } from 'src/payment-method/services/payment-method-details.service';

@Module({
  imports: [
    forwardRef(() => BuildingsModule),
    TypeOrmModule.forFeature([
      User,
      Building,
      Apartment,
      BuildingBill,
      IndividualBill,
      Payment,
      PaymentInfo,
      Expense,
      PaymentMethodList,
      PaymentMethodDetails,
    ]),

    forwardRef(() => PaymentsModule),
    forwardRef(() => PaymentMethodModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    PaymentMethodListService,
    PaymentMethodDetailsService,
    BuildingBillsService,
    BuildingsService,
    OutboundService,
    IndividualBillsService,
    BillingService,
  ],
  exports: [OutboundService],
  controllers: [OutboundController],
})
export class MailingModule {}
