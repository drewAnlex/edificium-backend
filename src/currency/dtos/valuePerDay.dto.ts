import { IsNotEmpty, IsNumber } from 'class-validator';
import { currencyList } from '../entities/currency-list.entity';
import { PartialType } from '@nestjs/swagger';

export class ValuePerDayDto implements Readonly<ValuePerDayDto> {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsNumber()
  currency: currencyList;
}

export class UpdateValuePerDayDto extends PartialType(ValuePerDayDto) {}
