import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBuildingDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly state: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly zone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly nApartments: number;

  @IsNotEmpty()
  @IsNumber()
  readonly status: number;
}
export class UpdateBuildingDto {
  readonly name?: string;
  readonly country?: string;
  readonly state?: string;
  readonly city?: string;
  readonly zone?: string;
  readonly nApartments?: number;
  readonly apartments?: any[];
  readonly administrators?: any[];
  readonly coOwners?: any[];
  readonly bills?: any[];
  readonly news?: any[];
  readonly status?: number;
}
