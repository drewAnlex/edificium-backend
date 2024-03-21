import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { BuildingBill } from '../entities/BuildingBill.entity';
import { Supplier } from '../entities/Supplier.entity';

export class CreateProductDto implements Readonly<CreateProductDto> {
  @IsNotEmpty()
  @IsNumber()
  BuildingBillsID: BuildingBill;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  supplierId: Supplier;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
