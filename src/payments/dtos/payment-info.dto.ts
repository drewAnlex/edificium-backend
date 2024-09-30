import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaymentMethod } from 'src/payment-method/entities/PaymentMethod.entity';
import { Payment } from '../entities/Payment.entity';

export class PaymentInfoDto implements Readonly<PaymentInfoDto> {
  @IsNotEmpty()
  @IsNumber()
  methodId: PaymentMethod;

  @IsNotEmpty()
  @IsNumber()
  payment: Payment;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdatePaymentInfoDto extends PartialType(PaymentInfoDto) {}
