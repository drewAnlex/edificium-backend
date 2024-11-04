import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { BuildingBill } from '../entities/BuildingBill.entity';
import { Building } from 'src/buildings/entities/building.entity';

export class CreateExpenseDTO implements Readonly<CreateExpenseDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isPaid: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isFixed: boolean;

  @IsNotEmpty()
  @IsBoolean()
  dependsOnShare: boolean;

  @IsBoolean()
  @IsOptional()
  isRemoved: any;

  @IsNotEmpty()
  @IsNumber()
  building: Building;

  @IsOptional()
  buildingBill: BuildingBill;

  @IsNotEmpty()
  @IsNumber()
  total: number;
}

export class UpdateExpenseDTO extends PartialType(CreateExpenseDTO) {}
