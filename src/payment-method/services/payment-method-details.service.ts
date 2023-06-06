import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethodDetails } from '../entities/payment-method-details';
import {
  PaymentMethodDetailsDto,
  UpdatePaymentMethodDetailsDto,
} from '../dtos/payment-method-details.dto';

@Injectable()
export class PaymentMethodDetailsService {
  private PaymentMethodDetails: PaymentMethodDetails[] = [
    {
      id: 1,
      MethodId: 1,
      Name: 'Cedula',
      description: 'Cedula de identidad',
      type: 'string',
      validation: '^[0-9]{7,8}$',
    },
  ];

  findAll() {
    return this.PaymentMethodDetails;
  }

  findOne(id: number) {
    const PaymentMethodDetails = this.PaymentMethodDetails.find(
      (item) => item.id === id,
    );
    if (!PaymentMethodDetails) {
      throw new NotFoundException(`PaymentMethodDetails #${id} not found`);
    }
    return PaymentMethodDetails;
  }

  create(data: PaymentMethodDetailsDto) {
    const newDetail = { id: this.PaymentMethodDetails.length + 1, ...data };
    this.PaymentMethodDetails.push(newDetail);
    return newDetail;
  }

  update(id: number, changes: UpdatePaymentMethodDetailsDto) {
    const PaymentMethodDetails = this.findOne(id);
    const index = this.PaymentMethodDetails.findIndex((item) => item.id === id);
    this.PaymentMethodDetails[index] = {
      ...PaymentMethodDetails,
      ...changes,
    };
    return this.PaymentMethodDetails[index];
  }

  remove(id: number) {
    const index = this.PaymentMethodDetails.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`PaymentMethodDetails #${id} not found`);
    }
    this.PaymentMethodDetails.splice(index, 1);
    return true;
  }
}
