import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { Contractor } from '../entities/Contractor.entity';
import { BuildingBill } from '../entities/BuildingBill.entity';

export class CreateServiceDTO implements Readonly<CreateServiceDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  contractorId: Contractor;

  @IsNotEmpty()
  @IsNumber()
  buildingBillId: BuildingBill;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
