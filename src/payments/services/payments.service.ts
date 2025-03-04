import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from '../entities/Payment.entity';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualBillsService } from './individual-bills.service';
import { BuildingBillsService } from './building-bills.service';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { OutboundService } from 'src/mailing/services/outbound.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private ibService: IndividualBillsService,
    private bbService: BuildingBillsService,
    private apartmentService: ApartmentsService,
    private outboundService: OutboundService,
  ) {}

  findAll() {
    return this.paymentRepo.find({
      where: { isRemoved: false },
      relations: ['IndividualBill', 'UserId', 'Method', 'paymentInfos'],
    });
  }

  async findUserPayments(userId: number) {
    return await this.paymentRepo.find({
      where: {
        UserId: {
          id: userId,
        },
        isRemoved: false,
      },
      relations: [
        'IndividualBill',
        'Method',
        'paymentInfos',
        'IndividualBill.apartmentId',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findBuildingPayments(buildingId: number) {
    return await this.paymentRepo.find({
      where: {
        isRemoved: false,
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
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: id, isRemoved: false },
      relations: [
        'IndividualBill',
        'IndividualBill.apartmentId',
        'UserId',
        'Method',
        'Method.paymentDetails',
        'paymentInfos',
      ],
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  async create(data: PaymentDTO, id: number) {
    const newPayment = this.paymentRepo.create({ ...data, UserId: { id: id } });
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

  async remove(id: number) {
    const payment = await this.findOne(id);
    try {
      this.paymentRepo.merge(payment, { isRemoved: true });
      await this.paymentRepo.save(payment);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return payment;
  }

  async updateStatus(id: number, status: number) {
    const payment = await this.findOne(id);
    const bill = await this.ibService.findOne(payment.IndividualBill.id);

    let amount = parseFloat(payment.Amount.toString());
    let balance = parseFloat(bill.Balance.toString());

    const apartmentId = bill.apartmentId.id;
    const apartment = await this.apartmentService.findOne(apartmentId);
    const apartmentBalance = parseFloat(apartment.balance.toString());
    await this.apartmentService.update(apartmentId, {
      balance: apartmentBalance + amount,
    });

    // Actualizar la bill actual
    const newBalance = Math.min(balance + amount, bill.Total);
    amount -= newBalance - balance;
    balance = newBalance;
    await this.ibService.updateBalance(
      bill.id,
      balance,
      balance >= bill.Total ? true : false,
    );

    // Distribuir sobrante entre otras bills no pagas del apartment
    if (amount > 0) {
      const unpaidBills = await this.ibService.findUnpaidBillsByApartment(
        apartmentId,
      );

      for (const unpaidBill of unpaidBills) {
        if (amount <= 0) break;

        let unpaidBalance = parseFloat(unpaidBill.Balance.toString());
        const unpaidNewBalance = Math.min(
          unpaidBalance + amount,
          unpaidBill.Total,
        );
        amount -= unpaidNewBalance - unpaidBalance;
        unpaidBalance = unpaidNewBalance;

        await this.ibService.updateBalance(
          unpaidBill.id,
          unpaidBalance,
          unpaidBalance >= unpaidBill.Total ? true : false,
        );
      }
    }

    await this.paymentRepo.merge(payment, { Status: status });
    await this.paymentRepo.save(payment);

    try {
      await this.outboundService.paymentConfirmationEmail(
        apartment.userId.email,
        apartment.userId,
        payment,
      );
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return payment;
  }
}
