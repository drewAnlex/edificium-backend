import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/PaymentMethod.entity';

export class PaymentMethodDetailsDto
  implements Readonly<PaymentMethodDetailsDto>
{
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  MethodId: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  validation: string;
}

export class UpdatePaymentMethodDetailsDto extends PartialType(
  PaymentMethodDetailsDto,
) {}
