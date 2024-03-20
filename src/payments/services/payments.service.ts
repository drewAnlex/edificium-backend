import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../entities/Payment.entity';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualBillsService } from './individual-bills.service';
import { BuildingBillsService } from './building-bills.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private ibService: IndividualBillsService,
    private bbService: BuildingBillsService,
  ) {}

  findAll() {
    return this.paymentRepo.find({
      relations: ['IndividualBill', 'UserId', 'Method', 'paymentInfos'],
    });
  }

  async findUserPayments(userId: number) {
    return await this.paymentRepo.find({
      where: {
        UserId: {
          id: userId,
        },
      },
      relations: ['IndividualBill', 'Method', 'paymentInfos'],
    });
  }

  async findBuildingPayments(buildingId: number) {
    return await this.paymentRepo.find({
      where: {
        Status: 0,
        IndividualBill: {
          apartmentId: {
            buildingId: {
              id: buildingId,
            },
          },
        },
      },
      relations: [
        'IndividualBill',
        'IndividualBill.apartmentId',
        'Method',
        'paymentInfos',
      ],
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: id },
      relations: ['IndividualBill', 'UserId', 'Method', 'paymentInfos'],
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
    return newPayment;
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

  async updateStatus(id: number, status: number) {
    const payment = await this.findOne(id);
    const bill = await this.ibService.findOne(payment.IndividualBill.id);
    const buildingBill = await this.bbService.findOne(bill.buildingBillId.id);
    const balance: string = bill.Balance.toString();
    const buildingBalance: string = buildingBill.balance.toString();
    const amount: string = payment.Amount.toString();
    const newBalance: number = parseFloat(amount) + parseFloat(balance);
    const updatedBalance: number = parseFloat(buildingBalance) + newBalance;
    if (newBalance == bill.Total) bill.IsPaid = true;
    await this.paymentRepo.merge(payment, { Status: status });
    await this.paymentRepo.save(payment);
    try {
      await this.ibService.update(bill.id, {
        Balance: newBalance,
        IsPaid: bill.IsPaid,
      });
      await this.bbService.update(buildingBill.id, {
        balance: updatedBalance,
      });
    } catch (error) {
      throw new HttpException(`Error ${error}`, 400);
    }
    return payment;
  }
}
