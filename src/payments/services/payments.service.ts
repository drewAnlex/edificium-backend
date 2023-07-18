import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../entities/Payment.entity';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  findAll() {
    return this.paymentRepo.find({
      relations: ['IndividualBill', 'UserId', 'Method'],
    });
  }

  findOne(id: number) {
    const payment = this.paymentRepo.findOne({
      where: { id: id },
      relations: ['IndividualBill', 'UserId', 'Method'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  async create(data: PaymentDTO) {
    const newPayment = this.paymentRepo.create(data);
    try {
      await this.paymentRepo.save(newPayment);
    } catch (error) {
      throw new HttpException(`Error ${error}`, 400);
    }
  }

  async update(id: number, changes: PaymentUpdateDTO) {
    const payment = await this.findOne(id);
    try {
      await this.paymentRepo.merge(payment, changes);
      await this.paymentRepo.save(payment);
    } catch (error) {
      throw new HttpException(`Error ${error}`, 400);
    }
    return payment;
  }

  remove(id: number) {
    return this.paymentRepo.delete(id);
  }
}
