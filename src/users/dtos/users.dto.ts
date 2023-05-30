import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsEmail,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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
  @IsString()
  readonly role: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly status: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
