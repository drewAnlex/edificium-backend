import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { IndividualBill } from '../entities/IndividualBill.entity';
import { PaymentMethod } from 'src/payment-method/entities/PaymentMethod.entity';

export class PaymentDTO implements Readonly<PaymentDTO> {
  @IsNotEmpty()
  @IsNumber()
  IndividualBill: IndividualBill;

  @IsNotEmpty()
  @IsString()
  PayCode: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Amount: number;

  @IsNotEmpty()
  @IsNumber()
  Method: PaymentMethod;
}

export class PaymentUpdateDTO extends PartialType(PaymentDTO) {}
