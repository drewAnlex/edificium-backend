import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateRoleDTO implements Readonly<CreateRoleDTO> {
  @IsNotEmpty()
  @IsString()
  Name: string;
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
