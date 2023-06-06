import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class PaymentInfoDto implements Readonly<PaymentInfoDto> {
  @IsNotEmpty()
  @IsNumber()
  methodId: number;

  @IsNotEmpty()
  @IsNumber()
  paymentId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdatePaymentInfoDto extends PartialType(PaymentInfoDto) {}
