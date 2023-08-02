import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { IndividualBill } from '../entities/IndividualBill.entity';
import { User } from 'src/users/entities/User.entity';
import { PaymentMethod } from 'src/payment-method/entities/PaymentMethod.entity';

export class PaymentDTO implements Readonly<PaymentDTO> {
  @IsNotEmpty()
  @IsNumber()
  IndividualBill: IndividualBill;

  @IsNotEmpty()
  @IsNumber()
  UserId: User;

  @IsNotEmpty()
  @IsNumber()
  Status: number;

  @IsNotEmpty()
  @IsString()
  PayCode: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Amount: number;

  @IsNotEmpty()
  @IsNumber()
  MethodId: PaymentMethod;
}

export class PaymentUpdateDTO extends PartialType(PaymentDTO) {}
