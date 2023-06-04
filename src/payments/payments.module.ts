import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { IndividualBillsService } from './services/individual-bills.service';
import { IndividualBillsController } from './controllers/individual-bills.controller';

@Module({
  providers: [ServicesService, ProductsService, IndividualBillsService],
  controllers: [ServicesController, ProductsController, IndividualBillsController]
})
export class PaymentsModule {}
