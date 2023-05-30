import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsBoolean,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsNumber()
  buildingBillId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  contractorId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
