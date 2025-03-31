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
import { Apartment } from 'src/buildings/entities/apartment.entity';

export class CreateIndividualExpenseDTO
  implements Readonly<CreateIndividualExpenseDTO>
{
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isPaid: boolean;

  @IsBoolean()
  @IsOptional()
  isRemoved: any;

  @IsNotEmpty()
  @IsNumber()
  building: Building;

  @IsNotEmpty()
  @IsNumber()
  apartmentId: Apartment;

  @IsOptional()
  buildingBill: BuildingBill;

  @IsNotEmpty()
  @IsNumber()
  total: number;
}

export class UpdateIndividualExpenseDTO extends PartialType(
  CreateIndividualExpenseDTO,
) {}
