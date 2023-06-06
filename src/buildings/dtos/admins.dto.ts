import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {}
