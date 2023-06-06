import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethodList } from '../entities/payment-method-list.entity';
import {
  PaymentMethodListDto,
  PartialPaymentMethodListDto,
} from '../dtos/payment-method-list.dto';

@Injectable()
export class PaymentMethodListService {
  private paymentMethodList: PaymentMethodList[] = [
    {
      id: 1,
      MethodId: 1,
      BuildingId: 1,
      Status: 1,
    },
    {
      id: 2,
      MethodId: 2,
      BuildingId: 2,
      Status: 2,
    },
  ];

  findAll() {
    return this.paymentMethodList;
  }

  findOne(id: number) {
    const paymentMethodList = this.paymentMethodList.find(
      (item) => item.id === id,
    );
    if (!paymentMethodList) {
      throw new NotFoundException(`Payment Method List #${id} not found`);
    }
    return paymentMethodList;
  }

  create(data: PaymentMethodListDto) {
    const newPaymentMethodList = {
      id: this.paymentMethodList.length + 1,
      ...data,
    };
    this.paymentMethodList.push(newPaymentMethodList);
    return newPaymentMethodList;
  }

  update(id: number, changes: PartialPaymentMethodListDto) {
    const paymentMethodList = this.findOne(id);
    const index = this.paymentMethodList.findIndex((item) => item.id === id);
    this.paymentMethodList[index] = {
      ...paymentMethodList,
      ...changes,
    };
    return this.paymentMethodList[index];
  }

  remove(id: number) {
    const index = this.paymentMethodList.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment Method List #${id} not found`);
    }
    this.paymentMethodList.splice(index, 1);
    return true;
  }
}
