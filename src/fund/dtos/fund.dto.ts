import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Building } from 'src/buildings/entities/building.entity';

export class FundDTO implements Readonly<FundDTO> {
  @IsNotEmpty()
  building: Building;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  balance: number;
}

export class UpdateFundDTO extends PartialType(FundDTO) {}
