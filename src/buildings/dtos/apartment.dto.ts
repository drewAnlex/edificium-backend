import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Building } from '../entities/building.entity';
import { User } from 'src/users/entities/User.entity';

export class CreateAparmentDTO {
  @IsNotEmpty()
  @IsString()
  readonly identifier: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly floor: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly share: number;

  @IsNotEmpty()
  @IsNumber()
  readonly balance: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly status: number;

  @IsNotEmpty()
  @IsNumber()
  readonly buildingId: Building;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: User;
}

export class UpdateAparmentDTO extends PartialType(CreateAparmentDTO) {}
