import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class PaymentMethodDto implements Readonly<PaymentMethodDto> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  status: number;
}

export class UpdatePaymentMethodDto extends PartialType(PaymentMethodDto) {}
