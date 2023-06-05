import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAdminDTO implements Readonly<CreateAdminDTO> {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  buildingId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;
}
