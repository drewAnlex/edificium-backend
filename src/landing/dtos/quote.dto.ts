import { PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsInt, Length } from 'class-validator';

export class CreateQuoteDto implements Readonly<CreateQuoteDto> {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(1, 15)
  phone: string;

  @IsString()
  @Length(1, 100)
  condominiumName: string;

  @IsInt()
  unitCount: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  condominiumName?: string;

  @IsOptional()
  @IsInt()
  unitCount?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
