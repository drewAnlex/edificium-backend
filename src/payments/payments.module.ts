import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
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

@Module({
  imports: [TypeOrmModule.forFeature([BuildingBill])],
  providers: [
    ServicesService,
    ProductsService,
    BuildingBillsService,
    IndividualBillsService,
    PaymentsService,
    PaymentInfoService,
  ],
  controllers: [
    ServicesController,
    ProductsController,
    BuildingBillsController,
    IndividualBillsController,
    PaymentsController,
    PaymentInfoController,
  ],
})
export class PaymentsModule {}
