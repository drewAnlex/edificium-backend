import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/PaymentMethod.entity';

export class PaymentMethodFieldDTO implements Readonly<PaymentMethodFieldDTO> {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  methodId: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class UpdatePaymentMethodFieldDTO extends PartialType(
  PaymentMethodFieldDTO,
) {}
