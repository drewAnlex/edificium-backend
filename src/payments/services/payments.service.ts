import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../entities/Payment';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

@Injectable()
export class PaymentsService {
  private payments: Payment[] = [
    {
      id: 1,
      IndividualBill: 1,
      UserId: 1,
      Status: 1,
      PayCode: '123456789',
      Amount: 100,
      MethodId: 1,
    },
  ];

  findAll() {
    return this.payments;
  }

  findOne(id: number) {
    const payment = this.payments.find((item) => item.id === id);
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  create(data: PaymentDTO) {
    const newPayment = { id: this.payments.length + 1, ...data };
    this.payments.push(newPayment);
    return newPayment;
  }

  update(id: number, changes: PaymentUpdateDTO) {
    const payment = this.findOne(id);
    const index = this.payments.findIndex((item) => item.id === id);
    this.payments[index] = { ...payment, ...changes };
    return this.payments[index];
  }

  remove(id: number) {
    const index = this.payments.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    this.payments.splice(index, 1);
    return true;
  }
}
