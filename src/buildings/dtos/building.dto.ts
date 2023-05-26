import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBuildingDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly state: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly zone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly nApartments: number;

  @IsNotEmpty()
  @IsNumber()
  readonly status: number;
}
export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}
