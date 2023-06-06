import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentInfoDto, UpdatePaymentInfoDto } from '../dtos/payment-info.dto';
import { PaymentInfo } from '../entities/payment-info';

@Injectable()
export class PaymentInfoService {
  private paymentInfo: PaymentInfo[] = [
    {
      id: 1,
      methodId: 1,
      paymentId: 1,
      name: 'CI',
      value: '123456789',
    },
  ];

  findAll() {
    return this.paymentInfo;
  }

  findOne(id: number) {
    const paymentInfo = this.paymentInfo.find((item) => item.id === id);
    if (!paymentInfo) {
      throw new NotFoundException(`Payment info #${id} not found`);
    }
    return paymentInfo;
  }

  findByPaymentId(paymentId: number) {
    const paymentInfo = this.paymentInfo.filter(
      (item) => item.paymentId === paymentId,
    );
    if (!paymentInfo) {
      throw new NotFoundException(`Payment info #${paymentId} not found`);
    }
    return paymentInfo;
  }

  create(data: PaymentInfoDto) {
    const newPaymentInfo = {
      id: this.paymentInfo.length + 1,
      ...data,
    };
    this.paymentInfo.push(newPaymentInfo);
    return newPaymentInfo;
  }

  update(id: number, changes: UpdatePaymentInfoDto) {
    const paymentInfo = this.findOne(id);
    const index = this.paymentInfo.findIndex((item) => item.id === id);
    this.paymentInfo[index] = {
      ...paymentInfo,
      ...changes,
    };
    return this.paymentInfo[index];
  }

  remove(id: number) {
    const index = this.paymentInfo.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Payment info #${id} not found`);
    }
    this.paymentInfo.splice(index, 1);
    return true;
  }
}
