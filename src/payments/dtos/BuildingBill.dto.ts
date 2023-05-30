import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBuildingBilDTO {
  @IsNotEmpty()
  @IsNumber()
  buildingId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total: number;
}

export class UpdateBuildingBillDTO extends PartialType(CreateBuildingBilDTO) {}
