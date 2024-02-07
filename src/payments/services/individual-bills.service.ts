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
    });
    if (!bills) {
      throw new NotFoundException(
        `Bills for apartment #${apartmentId} not found`,
      );
    }
    return bills;
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
}
