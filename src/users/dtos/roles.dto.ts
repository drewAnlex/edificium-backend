import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDTO {
  @IsNotEmpty()
  @IsString()
  Name: string;
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
