import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PaymentInfoDto implements Readonly<PaymentInfoDto> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdatePaymentInfoDto extends PartialType(PaymentInfoDto) {}
