import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class PaymentMethodListDto implements Readonly<PaymentMethodListDto> {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  MethodId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  BuildingId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Status: number;
}

export class PartialPaymentMethodListDto extends PartialType(
  PaymentMethodListDto,
) {}
