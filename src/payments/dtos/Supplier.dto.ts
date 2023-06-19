import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';
import { Product } from '../entities/Product.entity';

export class CreateSupplierDTO implements Readonly<CreateSupplierDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  product: Product;
}

export class UpdateSupplierDTO extends PartialType(CreateSupplierDTO) {}
