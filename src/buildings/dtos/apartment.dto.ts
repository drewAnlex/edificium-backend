import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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
}

export class UpdateAparmentDTO extends PartialType(CreateAparmentDTO) {}
