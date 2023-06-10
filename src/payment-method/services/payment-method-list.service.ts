import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethodList } from '../entities/payment-method-list.entity';
import {
  PaymentMethodListDto,
  PartialPaymentMethodListDto,
} from '../dtos/payment-method-list.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodListService {
  constructor(
    @InjectRepository(PaymentMethodList)
    private paymentMethodListRepo: Repository<PaymentMethodList>,
  ) {}

  findAll() {
    return this.paymentMethodListRepo.find();
  }

  findOne(id: number) {
    const paymentMethodList = this.paymentMethodListRepo.findOneBy({ id: id });
    if (paymentMethodList === null) {
      throw new NotFoundException(`Payment Method List #${id} not found`);
    }
    return paymentMethodList;
  }

  async create(data: PaymentMethodListDto) {
    const newPaymentMethodList = this.paymentMethodListRepo.create(data);
    try {
      await this.paymentMethodListRepo.save(newPaymentMethodList);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newPaymentMethodList;
  }

  async update(id: number, changes: PartialPaymentMethodListDto) {
    const paymentMethodList = await this.findOne(id);
    try {
      await this.paymentMethodListRepo.merge(paymentMethodList, changes);
      await this.paymentMethodListRepo.save(paymentMethodList);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return paymentMethodList;
  }

  remove(id: number) {
    return this.paymentMethodListRepo.delete(id);
  }
}
