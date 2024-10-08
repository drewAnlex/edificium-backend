import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethodDetails } from '../entities/payment-method-details.entity';
import {
  PaymentMethodDetailsDto,
  UpdatePaymentMethodDetailsDto,
} from '../dtos/payment-method-details.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodDetailsService {
  constructor(
    @InjectRepository(PaymentMethodDetails)
    private PaymentMethodDetailsRepo: Repository<PaymentMethodDetails>,
  ) {}

  findAll() {
    return this.PaymentMethodDetailsRepo.find({ relations: ['MethodId'] });
  }

  async findOne(id: number) {
    const PaymentMethodDetails = await this.PaymentMethodDetailsRepo.findOne({
      where: { id: id },
      relations: ['MethodId'],
    });
    if (!PaymentMethodDetails) {
      throw new NotFoundException(`PaymentMethodDetails #${id} not found`);
    }
    return PaymentMethodDetails;
  }

  async findOneByMethod(id: number) {
    const details = await this.PaymentMethodDetailsRepo.find({
      where: { MethodId: { id: id } },
    });
    if (!details) {
      throw new NotFoundException(`PaymentMethodDetails #${id} not found`);
    }
    return details;
  }

  async create(data: PaymentMethodDetailsDto) {
    const newPaymentMethodDetails = this.PaymentMethodDetailsRepo.create(data);
    try {
      await this.PaymentMethodDetailsRepo.save(newPaymentMethodDetails);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newPaymentMethodDetails;
  }

  async update(id: number, changes: UpdatePaymentMethodDetailsDto) {
    const PaymentMethodDetails = await this.findOne(id);
    try {
      await this.PaymentMethodDetailsRepo.merge(PaymentMethodDetails, changes);
      await this.PaymentMethodDetailsRepo.save(PaymentMethodDetails);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to update the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return PaymentMethodDetails;
  }

  remove(id: number) {
    return this.PaymentMethodDetailsRepo.delete(id);
  }
}
