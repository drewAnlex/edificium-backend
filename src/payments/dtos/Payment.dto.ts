import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { IndividualBill } from '../entities/IndividualBill.entity';
import { PaymentMethod } from 'src/payment-method/entities/PaymentMethod.entity';
import { User } from 'src/users/entities/User.entity';

export class PaymentDTO implements Readonly<PaymentDTO> {
  @IsNotEmpty()
  @IsNumber()
  IndividualBill: IndividualBill;

  @IsOptional()
  @IsString()
  PayCode: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Amount: number;

  @IsNotEmpty()
  @IsNumber()
  Method: PaymentMethod;

  @IsOptional()
  UserId: User;
}

export class PaymentUpdateDTO extends PartialType(PaymentDTO) {}
