import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto implements Readonly<CreateProductDto> {
  @IsNotEmpty()
  @IsNumber()
  BuildingBillsID: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  suplierId: number;

  @IsNotEmpty()
  @IsBoolean()
  IsPaid: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
