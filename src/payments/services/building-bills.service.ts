import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuildingBill } from '../entities/BuildingBill.entity';
import {
  CreateBuildingBillDTO,
  UpdateBuildingBillDTO,
} from '../dtos/BuildingBill.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BuildingBillsService {
  constructor(
    @InjectRepository(BuildingBill) private billRepo: Repository<BuildingBill>,
  ) {}

  findAll() {
    return this.billRepo.find({
      relations: [
        'buildingId',
        'userId',
        'services',
        'products',
        'individualBills',
      ],
    });
  }

  async findOne(id: number) {
    const bill = await this.billRepo.findOne({
      where: { id: id },
      relations: [
        'buildingId',
        'userId',
        'services',
        'products',
        'individualBills',
      ],
    });
    if (!bill) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }
    return bill;
  }

  async create(payload: CreateBuildingBillDTO) {
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

  async update(id: number, payload: UpdateBuildingBillDTO) {
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

  delete(id: number) {
    return this.billRepo.delete(id);
  }
}
