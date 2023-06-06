import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { IndividualBillsService } from './services/individual-bills.service';
import { IndividualBillsController } from './controllers/individual-bills.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentInfoService } from './services/payment-info.service';
import { PaymentInfoController } from './controllers/payment-info.controller';

@Module({
  providers: [ServicesService, ProductsService, IndividualBillsService, PaymentsService, PaymentInfoService],
  controllers: [ServicesController, ProductsController, IndividualBillsController, PaymentsController, PaymentInfoController]
})
export class PaymentsModule {}
