import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateContractorDTO implements Readonly<CreateContractorDTO> {
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

export class UpdateContractorDTO extends PartialType(CreateContractorDTO) {}
