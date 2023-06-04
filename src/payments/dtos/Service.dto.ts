import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDTO implements Readonly<CreateServiceDTO> {
  @IsNotEmpty()
  @IsNumber()
  buildingBillId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  contractorId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
