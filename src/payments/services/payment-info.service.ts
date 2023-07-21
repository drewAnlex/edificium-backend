import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentInfoDto, UpdatePaymentInfoDto } from '../dtos/payment-info.dto';
import { PaymentInfo } from '../entities/payment-info.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentInfoService {
  constructor(
    @InjectRepository(PaymentInfo) private infoRepo: Repository<PaymentInfo>,
  ) {}

  findAll() {
    return this.infoRepo.find({ relations: ['payment', 'methodId'] });
  }

  findOne(id: number) {
    const paymentInfo = this.infoRepo.findOne({
      where: { id: id },
      relations: ['payment', 'methodId'],
    });
    if (!paymentInfo) {
      throw new NotFoundException(`Payment info #${id} not found`);
    }
    return paymentInfo;
  }

  findByPaymentId(paymentId: number) {
    const paymentInfo = this.infoRepo.find({
      where: { payment: { id: paymentId } },
    });
    if (!paymentInfo) {
      throw new NotFoundException(`Payment info #${paymentId} not found`);
    }
    return paymentInfo;
  }

  async create(data: PaymentInfoDto) {
    const newPaymentInfo = this.infoRepo.create(data);
    try {
      await this.infoRepo.save(newPaymentInfo);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return newPaymentInfo;
  }

  async update(id: number, changes: UpdatePaymentInfoDto) {
    const paymentInfo = await this.findOne(id);
    try {
      await this.infoRepo.merge(paymentInfo, changes);
      await this.infoRepo.save(paymentInfo);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return paymentInfo;
  }

  remove(id: number) {
    return this.infoRepo.delete(id);
  }
}
