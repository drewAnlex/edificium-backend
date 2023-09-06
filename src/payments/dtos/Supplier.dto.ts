import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

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
}

export class UpdateSupplierDTO extends PartialType(CreateSupplierDTO) {}
