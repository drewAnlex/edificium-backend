import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { Building } from 'src/buildings/entities/building.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsOptional()
  readonly role: Role;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly status: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly building: Building;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
