import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      BuildingBill,
      IndividualBill,
      Expense,
      User,
    ]),
    PaymentsModule,
    BuildingsModule,
  ],
  providers: [
    BillingService,
    BuildingBillsService,
    IndividualBillsService,
    UsersService,
    ApartmentsService,
    OutboundService,
  ],
  controllers: [BillingController],
})
export class ReportsModule {}
