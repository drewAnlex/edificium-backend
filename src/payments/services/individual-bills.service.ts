import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IndividualBill } from '../entities/IndividualBill.entity';
import {
  IndividualBillDto,
  UpdateIndividualBillDto,
} from '../dtos/IndividualBill.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IndividualBillsService {
  constructor(
    @InjectRepository(IndividualBill)
    private billRepo: Repository<IndividualBill>,
  ) {}

  findAll() {
    return this.billRepo.find();
  }

  async findByApartment(apartmentId: number, ownerId: number) {
    const bills = await this.billRepo.find({
      where: { apartmentId: { id: apartmentId, userId: { id: ownerId } } },
      relations: ['buildingBillId'],
      order: { createdAt: 'DESC' },
    });
    if (!bills) {
      throw new NotFoundException(
        `Bills for apartment #${apartmentId} not found`,
      );
    }
    return bills;
  }

  async findOneByIdAndApartment(id: number, apartmentId: number) {
    const bill = await this.billRepo.findOne({
      where: { id: id, apartmentId: { id: apartmentId } },
      relations: [
        'buildingBillId',
        'buildingBillId.services',
        'buildingBillId.products',
        'apartmentId',
      ],
    });
    if (!bill) {
      throw new NotFoundException(`Bill #${id} not found`);
    }
    return bill;
  }

  async findOne(id: number) {
    const bill = await this.billRepo.findOne({
      where: { id: id },
      relations: ['buildingBillId'],
    });
    if (!bill) {
      throw new NotFoundException(`Bill #${id} not found`);
    }
    return bill;
  }

  async create(payload: IndividualBillDto) {
    const newBill = this.billRepo.create(payload);
    try {
      await this.billRepo.save(newBill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newBill;
  }

  async update(id: number, payload: UpdateIndividualBillDto) {
    const bill = await this.findOne(id);
    try {
      await this.billRepo.merge(bill, payload);
      await this.billRepo.save(bill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  remove(id: number) {
    return this.billRepo.delete(id);
  }

  async individualDebt(userId: number) {
    const bills = await this.billRepo.find({
      where: {
        apartmentId: { userId: { id: userId } },
        IsPaid: false,
      },
    });
    console.log(bills);
    let debt = 0;
    bills.forEach((bill) => {
      const total = parseFloat(bill.Total.toString());
      const balance = parseFloat(bill.Balance.toString());
      debt = debt + total - balance;
    });
    return debt;
  }

  async adminIndividualDebt(apartmentId: number) {
    const bills = await this.billRepo.find({
      where: {
        apartmentId: { id: apartmentId },
        IsPaid: false,
      },
    });
    let debt = 0;
    bills.forEach((bill) => {
      const total = parseFloat(bill.Total.toString());
      const balance = parseFloat(bill.Balance.toString());
      debt = debt + total - balance;
    });
    return debt;
  }

  async apartmentsWithDebt(buildingId: number) {
    const apartments = await this.billRepo.find({
      where: {
        buildingBillId: { buildingId: { id: buildingId } },
        IsPaid: false,
      },
      relations: ['apartmentId'],
    });
    const uniqueApartmentIds = new Set(
      apartments.map((apartment) => apartment.apartmentId.id),
    );
    return uniqueApartmentIds.size;
  }
}
