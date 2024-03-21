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
import { IndividualBill } from './entities/IndividualBill.entity';
import { Apartment } from '../buildings/entities/Apartment.entity';
import { Service } from './entities/Service.entity';
import { Contractor } from './entities/Contractor.entity';
import { ContractorService } from './services/contractor.service';
import { ContractorController } from './controllers/contractor.controller';
import { Supplier } from './entities/Supplier.entity';
import { Product } from './entities/Product.entity';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './controllers/supplier.controller';
import { Payment } from './entities/Payment.entity';
import { PaymentInfo } from './entities/payment-info.entity';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { MyBuildingBillsController } from './controllers/my-building-bills.controller';
import { MyContractorsController } from './controllers/my-contractors.controller';
import { MyServicesController } from './controllers/my-services.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      BuildingBill,
      IndividualBill,
      Service,
      Payment,
      PaymentInfo,
      Contractor,
      Product,
      Supplier,
    ]),
    BuildingsModule,
  ],
  providers: [
    ServicesService,
    ProductsService,
    BuildingBillsService,
    IndividualBillsService,
    PaymentsService,
    PaymentInfoService,
    ContractorService,
    SupplierService,
  ],
  controllers: [
    ServicesController,
    ProductsController,
    BuildingBillsController,
    IndividualBillsController,
    PaymentsController,
    PaymentInfoController,
    ContractorController,
    SupplierController,
    MyBuildingBillsController,
    MyContractorsController,
    MyServicesController,
  ],
})
export class PaymentsModule {}
