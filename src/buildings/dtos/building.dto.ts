import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBuildingDto implements Readonly<CreateBuildingDto> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  zone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  nApartments: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}

export class FilterBuildingsDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}
