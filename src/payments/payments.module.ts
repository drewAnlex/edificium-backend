import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      BuildingBill,
      IndividualBill,
      Payment,
      PaymentInfo,
      Expense,
    ]),
    BuildingsModule,
  ],
  providers: [
    BuildingBillsService,
    IndividualBillsService,
    PaymentsService,
    PaymentInfoService,
    ExpenseService,
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
