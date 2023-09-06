import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
}

export class UpdateBuildingBillDTO extends PartialType(CreateBuildingBillDTO) {}
