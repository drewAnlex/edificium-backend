import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class IndividualBillDto implements Readonly<IndividualBillDto> {
  @IsNotEmpty()
  @IsNumber()
  BuildingBillId: number;

  @IsNotEmpty()
  @IsNumber()
  ApartmentId: number;

  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsNotEmpty()
  @IsString()
  Description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Total: number;

  @IsNotEmpty()
  @IsNumber()
  Balance: number;

  @IsNotEmpty()
  @IsBoolean()
  IsPaid: boolean;
}

export class UpdateIndividualBillDto extends PartialType(IndividualBillDto) {}
