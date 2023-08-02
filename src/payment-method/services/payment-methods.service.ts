import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../entities/PaymentMethod.entity';
import {
  PaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/PaymentMethod.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private PaymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  findAll() {
    return this.PaymentMethodRepo.find({
      relations: ['paymentInfos', 'paymentDetails', 'payments'],
    });
  }

  async findOne(id: number) {
    const PaymentMethod = await this.PaymentMethodRepo.findOne({
      where: { id: id },
      relations: ['paymentInfos', 'paymentDetails', 'payments'],
    });
    if (PaymentMethod === null) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    return PaymentMethod;
  }

  create(data: PaymentMethodDto) {
    const newPaymentMethod = this.PaymentMethodRepo.create(data);
    return this.PaymentMethodRepo.save(newPaymentMethod);
  }

  async update(id: number, changes: UpdatePaymentMethodDto) {
    const PaymentMethod = await this.findOne(id);
    if (PaymentMethod === null) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    this.PaymentMethodRepo.merge(PaymentMethod, changes);
    return this.PaymentMethodRepo.save(PaymentMethod);
  }

  remove(id: number) {
    return this.PaymentMethodRepo.delete(id);
  }
}
