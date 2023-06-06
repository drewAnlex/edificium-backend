import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class PaymentDTO implements Readonly<PaymentDTO> {
  @IsNotEmpty()
  @IsNumber()
  IndividualBill: number;

  @IsNotEmpty()
  @IsNumber()
  UserId: number;

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
  MethodId: number;
}

export class PaymentUpdateDTO extends PartialType(PaymentDTO) {}
