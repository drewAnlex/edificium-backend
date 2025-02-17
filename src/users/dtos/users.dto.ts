import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly provider: string;

  @IsOptional()
  @IsString()
  readonly IdDocument?: string;

  @IsOptional()
  @IsString()
  readonly avatar: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly resetToken: string;

  @IsOptional()
  @IsString()
  readonly resetTokenExpires: Date;

  @IsOptional()
  @IsString()
  readonly vinculationCode: string;

  @IsOptional()
  @IsString()
  readonly vinculationCodeExpires: Date;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
