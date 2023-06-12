import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Building } from '../entities/building.entity';
import { User } from 'src/users/entities/User.entity';

export class CreateAdminDTO implements Readonly<CreateAdminDTO> {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  buildingId: Building;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: User;
}

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {}
