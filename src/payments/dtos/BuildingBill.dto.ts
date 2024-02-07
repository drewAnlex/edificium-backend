import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBuildingBillDTO implements Readonly<CreateBuildingBillDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  balance: number;
}

export class UpdateBuildingBillDTO extends PartialType(CreateBuildingBillDTO) {}
