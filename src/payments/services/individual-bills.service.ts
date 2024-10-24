import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { BuildingBillsService } from './building-bills.service';

@Injectable()
export class IndividualBillsService {
  constructor(
    @InjectRepository(IndividualBill)
    private billRepo: Repository<IndividualBill>,
    private apartmentService: ApartmentsService,
    @Inject(forwardRef(() => BuildingBillsService))
    private bbService: BuildingBillsService,
  ) {}

  findAll() {
    return this.billRepo.find();
  }

  async findUnpaidBillsByApartment(apartmentId: number) {
    const bills = await this.billRepo.find({
      where: {
        IsPaid: false,
        isRemoved: false,
        apartmentId: { id: apartmentId },
      },
    });
    if (!bills) {
      throw new NotFoundException(
        `Bills for apartment #${apartmentId} not found`,
      );
    }
    return bills;
  }

  async findByApartment(apartmentId: number, ownerId: number) {
    const bills = await this.billRepo.find({
      where: {
        apartmentId: { id: apartmentId, userId: { id: ownerId } },
        isRemoved: false,
      },
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

  async findAllByApartment(apartmentId: number) {
    const bills = await this.billRepo.find({
      where: {
        apartmentId: { id: apartmentId },
        isRemoved: false,
      },
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
      where: { id: id, apartmentId: { id: apartmentId }, isRemoved: false },
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
      where: { id: id, isRemoved: false },
      relations: [
        'buildingBillId',
        'buildingBillId.buildingId',
        'apartmentId',
        'apartmentId.buildingId',
      ],
    });
    if (!bill) {
      throw new NotFoundException(`Bill #${id} not found`);
    }
    return bill;
  }

  async create(payload: IndividualBillDto, id?: number) {
    const apartmentId = id ? id : payload.apartmentId.id;
    const apartment = await this.apartmentService.findOne(apartmentId);
    const balance = apartment.balance.toString();
    if (apartment.balance > 0) {
      payload.Balance =
        parseFloat(payload.Balance.toString()) + parseFloat(balance);
    }
    const newBill = this.billRepo.create(payload);
    try {
      await this.billRepo.save(newBill);
      const total = payload.Total.toFixed(2);
      await this.apartmentService.update(apartmentId, {
        balance: parseFloat(balance) - parseFloat(total),
      });
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

  async updateBalance(id: number, balance: number, status: boolean) {
    const bill = await this.findOne(id);
    try {
      this.billRepo.merge(bill, { IsPaid: status, Balance: balance });
      await this.billRepo.save(bill);
      if (bill.buildingBillId?.id) {
        await this.bbService.updateBalance(bill.buildingBillId.id, balance);
      }
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  async remove(id: number) {
    const bill = await this.findOne(id);
    if (bill.buildingBillId != null || bill.Balance != 0)
      throw new HttpException(
        `Recibo asociado existente`,
        HttpStatus.BAD_REQUEST,
      );
    try {
      this.billRepo.merge(bill, { isRemoved: true });
      await this.billRepo.save(bill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  async individualDebt(userId: number) {
    const apartments = await this.apartmentService.getApartmentsByOwner(userId);
    const debt = apartments.reduce((acc, apartment) => {
      return apartment.balance < 0
        ? acc + parseFloat(apartment.balance.toString())
        : acc;
    }, 0);
    return debt;
  }

  async adminIndividualDebt(apartmentId: number) {
    const bills = await this.billRepo.find({
      where: [
        {
          apartmentId: { id: apartmentId },
          IsPaid: false,
          isRemoved: false,
          buildingBillId: { isRemoved: false },
        },
        {
          apartmentId: { id: apartmentId },
          IsPaid: false,
          isRemoved: false,
        },
      ],
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
        buildingBillId: { buildingId: { id: buildingId }, isRemoved: false },
        IsPaid: false,
        isRemoved: false,
      },
      relations: ['apartmentId'],
    });
    const uniqueApartmentIds = new Set(
      apartments.map((apartment) => apartment.apartmentId.id),
    );
    return uniqueApartmentIds.size;
  }
}
