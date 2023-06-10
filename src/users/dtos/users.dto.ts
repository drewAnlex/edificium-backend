import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsEmail,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

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
  readonly role: Role;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly status: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
