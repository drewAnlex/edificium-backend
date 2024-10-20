import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../entities/Payment.entity';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualBillsService } from './individual-bills.service';
import { BuildingBillsService } from './building-bills.service';
import { ApartmentsService } from 'src/buildings/services/apartments.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private ibService: IndividualBillsService,
    private bbService: BuildingBillsService,
    private apartmentService: ApartmentsService,
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
      order: { createdAt: 'DESC' },
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
      order: { createdAt: 'DESC' },
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

  remove(id: number) {
    return this.paymentRepo.delete(id);
  }

  async updateStatus(id: number, status: number) {
    const payment = await this.findOne(id);
    const bill = await this.ibService.findOne(payment.IndividualBill.id);

    // Manejar la ausencia de buildingBill
    let buildingBill;
    try {
      buildingBill = await this.bbService.findOne(bill.buildingBillId.id);
    } catch (error) {
      // Si no se encuentra buildingBill, ignora la actualización de su balance
      console.warn('Building Bill not found:', error.message);
    }

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
    console.log(bill.Total, balance);
    console.log(balance >= bill.Total ? true : false);

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

    // Actualizar buildingBill si existe
    if (buildingBill) {
      const updatedBalance =
        parseFloat(buildingBill.balance.toString()) +
        (newBalance - parseFloat(bill.Balance.toString()));
      await this.bbService.update(buildingBill.id, { balance: updatedBalance });
    }

    return payment;
  }
}
