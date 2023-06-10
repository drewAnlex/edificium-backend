import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/PaymentMethod.entity';
import { Building } from 'src/buildings/entities/building.entity';

export class PaymentMethodListDto implements Readonly<PaymentMethodListDto> {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  MethodId: PaymentMethod;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  BuildingId: Building;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Status: number;
}

export class PartialPaymentMethodListDto extends PartialType(
  PaymentMethodListDto,
) {}
