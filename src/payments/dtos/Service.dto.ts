import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { Contractor } from '../entities/Contractor.entity';
import { BuildingBill } from '../entities/BuildingBill.entity';

export class CreateServiceDTO implements Readonly<CreateServiceDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  contractorId: Contractor;

  @IsNotEmpty()
  @IsNumber()
  buildingBillId: BuildingBill;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
