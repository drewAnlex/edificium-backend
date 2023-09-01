import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from 'src/users/entities/User.entity';
import { Building } from 'src/buildings/entities/building.entity';

export class CreateBuildingBillDTO implements Readonly<CreateBuildingBillDTO> {
  @IsNotEmpty()
  @IsNumber()
  buildingId: Building;

  @IsNotEmpty()
  @IsNumber()
  userId: User;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total: number;
}

export class UpdateBuildingBillDTO extends PartialType(CreateBuildingBillDTO) {}
