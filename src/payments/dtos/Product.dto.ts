import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
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
  suplierId: Supplier;

  @IsNotEmpty()
  @IsBoolean()
  IsPaid: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
