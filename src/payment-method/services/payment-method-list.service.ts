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
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';

@Injectable()
export class PaymentMethodListService {
  constructor(
    @InjectRepository(PaymentMethodList)
    private paymentMethodListRepo: Repository<PaymentMethodList>,
    private ibService: IndividualBillsService,
  ) {}

  findAll() {
    return this.paymentMethodListRepo.find({
      relations: ['MethodId', 'BuildingId'],
    });
  }

  async findByIndividualBill(id: number) {
    const individualBill = await this.ibService.findOne(id);
    const building = individualBill.buildingBillId.buildingId.id;
    const list = await this.findByBuilding(building);
    return list;
  }

  async findByBuilding(id: number) {
    const list = await this.paymentMethodListRepo.find({
      where: { BuildingId: { id: id } },
      relations: ['MethodId', 'MethodId.paymentDetails'],
    });
    if (!list) {
      throw new NotFoundException(`Payment Method List #${id} not found`);
    }
    return list.map((paymentMethod) => paymentMethod.MethodId);
  }

  findOne(id: number) {
    const paymentMethodList = this.paymentMethodListRepo.findOne({
      where: { id: id },
      relations: ['MethodId', 'BuildingId'],
    });
    if (!paymentMethodList) {
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
