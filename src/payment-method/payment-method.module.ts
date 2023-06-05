import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './services/payment-methods.service';
import { PaymentMethodsController } from './controllers/payment-methods.controller';
import { PaymentMethodListService } from './services/payment-method-list.service';
import { PaymentMethodListController } from './controllers/payment-method-list.controller';

@Module({
  controllers: [PaymentMethodsController, PaymentMethodListController],
  providers: [PaymentMethodsService, PaymentMethodListService],
})
export class PaymentMethodModule {}
