import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './services/payment-methods.service';
import { PaymentMethodsController } from './controllers/payment-methods.controller';
import { PaymentMethodListService } from './services/payment-method-list.service';
import { PaymentMethodListController } from './controllers/payment-method-list.controller';
import { PaymentMethodDetailsService } from './services/payment-method-details.service';
import { PaymentMethodDetailsController } from './controllers/payment-method-details.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/PaymentMethod.entity';
import { PaymentMethodList } from './entities/payment-method-list.entity';
import { PaymentMethodDetails } from './entities/payment-method-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
      PaymentMethodList,
      PaymentMethodDetails,
    ]),
  ],
  controllers: [
    PaymentMethodsController,
    PaymentMethodListController,
    PaymentMethodDetailsController,
  ],
  providers: [
    PaymentMethodsService,
    PaymentMethodListService,
    PaymentMethodDetailsService,
  ],
})
export class PaymentMethodModule {}
