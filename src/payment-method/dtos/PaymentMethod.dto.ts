import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PaymentMethodDto implements Readonly<PaymentMethodDto> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  status: number;
}

export class UpdatePaymentMethodDto extends PartialType(PaymentMethodDto) {}
