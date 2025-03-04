import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';
import { WhatsappService } from './services/whatsapp.service';
import { MessageHandlerService } from './services/message-handler.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/User.entity';
import { OutboundService } from 'src/mailing/services/outbound.service';
import { MailingModule } from 'src/mailing/mailing.module';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { BillingService } from 'src/reports/services/billing.service';
import { ReportsModule } from 'src/reports/reports.module';
import { Building } from 'src/buildings/entities/building.entity';
import { currencyValuePerDay } from 'src/currency/entities/currency-value-per-day.entity';
import { PaymentMethodDetails } from 'src/payment-method/entities/payment-method-details.entity';
import { PaymentMethodList } from 'src/payment-method/entities/payment-method-list.entity';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';
import { CurrencyModule } from 'src/currency/currency.module';
import { PaymentMethodFieldsService } from 'src/payment-method/services/payment-method-fields.service';
import { PaymentMethodFields } from 'src/payment-method/entities/payment-method-fields.entity';
import { PaymentsService } from 'src/payments/services/payments.service';
import { PaymentInfoService } from 'src/payments/services/payment-info.service';
import { Payment } from 'src/payments/entities/Payment.entity';
import { PaymentInfo } from 'src/payments/entities/payment-info.entity';
import { SendToWhatsappService } from './services/http-service/send-to-whatsapp.service';
import { Quote } from 'src/landing/entities/Quote.entity';
import { LandingModule } from 'src/landing/landing.module';
import { QuotesService } from 'src/landing/services/quotes.service';
import { Role } from 'src/users/entities/Role.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { ExpenseService } from 'src/payments/services/expense.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      User,
      Role,
      BuildingBill,
      IndividualBill,
      Building,
      PaymentMethodList,
      PaymentMethodDetails,
      currencyValuePerDay,
      PaymentMethodFields,
      Payment,
      PaymentInfo,
      Quote,
      Expense,
    ]),
    UsersModule,
    MailingModule,
    BuildingsModule,
    PaymentsModule,
    ReportsModule,
    PaymentMethodModule,
    CurrencyModule,
    LandingModule,
  ],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    MessageHandlerService,
    UsersService,
    OutboundService,
    BuildingBillsService,
    IndividualBillsService,
    BillingService,
    PaymentMethodListService,
    CurrencyValuePerDayService,
    PaymentMethodFieldsService,
    PaymentsService,
    PaymentInfoService,
    SendToWhatsappService,
    QuotesService,
    ExpenseService,
  ],
})
export class BotsModule {}
