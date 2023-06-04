import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';

@Module({
  providers: [ServicesService, ProductsService],
  controllers: [ServicesController, ProductsController]
})
export class PaymentsModule {}
