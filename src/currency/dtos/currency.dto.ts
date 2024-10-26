import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CurrencyDto implements Readonly<CurrencyDto> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  short: string;

  @IsNotEmpty()
  @IsString()
  simbol: string;
}

export class UpdateCurrencyDto extends PartialType(CurrencyDto) {}
