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
import { BuildingsService } from '../../buildings/services/buildings.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualBillsService } from './individual-bills.service';
import { IndividualBillDto } from '../dtos/IndividualBill.dto';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BuildingBillsService {
  constructor(
    @InjectRepository(BuildingBill) private billRepo: Repository<BuildingBill>,
    private buildingService: BuildingsService,
    private billService: IndividualBillsService,
  ) {}

  findAll() {
    return this.billRepo.find({
      relations: ['buildingId'],
    });
  }

  async findOneByUuid(uuid: string) {
    const bill = await this.billRepo.findOne({
      where: { uuid: uuid },
      relations: ['buildingId'],
    });
    if (!bill) {
      throw new NotFoundException(`Building Bill #${uuid} not found`);
    }
    return bill;
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
    newBill.uuid = uuidv4();
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

  async setToPublished(uuid: string) {
    const bill = await this.findOneByUuid(uuid);
    const building = await this.buildingService.findOne(bill.buildingId.id);
    (await building).apartments.forEach((Apartment) => {
      const payload: IndividualBillDto = {
        buildingBillId: bill,
        apartmentId: Apartment,
        Total: bill.total * Apartment.share,
        Name: bill.name,
        Description: bill.description,
        IsPaid: false,
        Balance: 0,
      };
      try {
        this.billService.create(payload);
      } catch (error) {
        throw new HttpException(
          `An error occurred: ${error}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    try {
      await this.billRepo.merge(bill, { isPublished: true });
      await this.billRepo.save(bill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }
}
