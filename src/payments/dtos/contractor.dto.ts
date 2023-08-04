import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Building } from 'src/buildings/entities/building.entity';

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

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsNumber()
  buildings: Building[];
}

export class UpdateContractorDTO extends PartialType(CreateContractorDTO) {}
