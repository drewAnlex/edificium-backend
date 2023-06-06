import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../entities/PaymentMethod.entity';
import {
  PaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/PaymentMethod.dto';

@Injectable()
export class PaymentMethodsService {
  private PaymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: 'Credit Card',
      status: 1,
    },
  ];

  findAll() {
    return this.PaymentMethods;
  }

  findOne(id: number) {
    const PaymentMethod = this.PaymentMethods.find((item) => item.id === id);
    if (!PaymentMethod) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    return PaymentMethod;
  }

  create(data: PaymentMethodDto) {
    const newPaymentMethod = {
      id: this.PaymentMethods.length + 1,
      ...data,
    };
    this.PaymentMethods.push(newPaymentMethod);
    return newPaymentMethod;
  }

  update(id: number, changes: UpdatePaymentMethodDto) {
    const PaymentMethod = this.findOne(id);
    const index = this.PaymentMethods.findIndex((item) => item.id === id);
    this.PaymentMethods[index] = {
      ...PaymentMethod,
      ...changes,
    };
    return this.PaymentMethods[index];
  }

  remove(id: number) {
    const index = this.PaymentMethods.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    this.PaymentMethods.splice(index, 1);
    return true;
  }
}
