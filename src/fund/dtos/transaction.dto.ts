import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Fund } from '../entities/Fund.entity';
import { PartialType } from '@nestjs/swagger';

export class TransactionDTO implements Readonly<TransactionDTO> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  fund: Fund;
}

export class UpdateTransactionDTO extends PartialType(TransactionDTO) {}
