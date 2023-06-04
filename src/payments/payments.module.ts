import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { IndividualBillsService } from './services/individual-bills.service';
import { IndividualBillsController } from './controllers/individual-bills.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  providers: [ServicesService, ProductsService, IndividualBillsService, PaymentsService],
  controllers: [ServicesController, ProductsController, IndividualBillsController, PaymentsController]
})
export class PaymentsModule {}
