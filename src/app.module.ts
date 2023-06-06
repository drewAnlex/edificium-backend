import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsModule } from './buildings/buildings.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BuildingsModule, UsersModule, PaymentsModule, PaymentMethodModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
