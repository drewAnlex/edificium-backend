import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Apartment } from 'src/buildings/entities/apartment.entity';
import { BuildingBill } from '../entities/BuildingBill.entity';

export class IndividualBillDto implements Readonly<IndividualBillDto> {
  @IsNotEmpty()
  @IsNumber()
  buildingBillId: BuildingBill;

  @IsNotEmpty()
  @IsNumber()
  apartmentId: Apartment;

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

  @IsOptional()
  @IsNumber()
  Balance: number;

  @IsOptional()
  @IsBoolean()
  IsPaid: boolean;
}

export class UpdateIndividualBillDto extends PartialType(IndividualBillDto) {}
