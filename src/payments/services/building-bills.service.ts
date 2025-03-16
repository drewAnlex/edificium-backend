import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { Expense } from '../entities/Expense.entity';
import { ExpenseService } from './expense.service';

@Injectable()
export class BuildingBillsService {
  constructor(
    @InjectRepository(BuildingBill) private billRepo: Repository<BuildingBill>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @Inject(forwardRef(() => BuildingsService))
    private buildingService: BuildingsService,
    private billService: IndividualBillsService,
    private expenseService: ExpenseService,
  ) {}

  async getLatestForEmail(building: number) {
    return await this.billRepo.findOne({
      where: {
        isPublished: true,
        buildingId: { id: building },
        isRemoved: false,
      },
      order: { createdAt: 'DESC' },
      relations: [
        'buildingId',
        'buildingId.apartments',
        'buildingId.apartments.userId',
        'buildingId.admins',
      ],
    });
  }

  async getLatestForEmailPreview(building: number) {
    return await this.billRepo.findOne({
      where: {
        isPublished: false,
        buildingId: { id: building },
        isRemoved: false,
      },
      order: { createdAt: 'DESC' },
      relations: [
        'buildingId',
        'buildingId.apartments',
        'buildingId.apartments.userId',
        'buildingId.admins',
      ],
    });
  }

  getLatest(buildingId: number) {
    return this.billRepo.findOne({
      where: {
        isPublished: true,
        buildingId: { id: buildingId },
        isRemoved: false,
      },
      order: { createdAt: 'DESC' },
      relations: ['expenses'],
    });
  }

  async isNotPublished(buildingId: number) {
    const bills = await this.billRepo.find({
      where: {
        isPublished: false,
        buildingId: { id: buildingId },
        isRemoved: false,
      },
      relations: ['buildingId'],
    });
    if (!bills) {
      throw new NotFoundException(`Building Bill not found`);
    }
    return bills;
  }

  findAll() {
    return this.billRepo.find({
      relations: ['buildingId', 'userId'],
    });
  }

  async findByOwner(buildingId: number, userId: number) {
    const buildingBills = await this.billRepo.find({
      // where: {
      //   buildingId: { id: buildingId, apartments: { userId: { id: userId } } },
      //   isPublished: true,
      // },
      where: [
        {
          buildingId: { id: buildingId, admins: { id: userId } },
          isPublished: true,
          isRemoved: false,
        },
        {
          buildingId: {
            id: buildingId,
            apartments: { userId: { id: userId } },
          },
          isPublished: true,
          isRemoved: false,
        },
      ],
      order: { createdAt: 'DESC' },
    });
    if (!buildingBills) {
      throw new NotFoundException(`Building Bill not found`);
    }
    return buildingBills;
  }

  async findOneByOwner(id: number, userId: number) {
    const bill = await this.billRepo.findOne({
      where: [
        {
          id: id,
          buildingId: { apartments: { userId: { id: userId } } },
          isRemoved: false,
        },
        { id: id, buildingId: { admins: { id: userId } }, isRemoved: false },
      ],
      select: ['id', 'name', 'description', 'createdAt', 'total'],
      relations: [
        'expenses',
        'buildingId',
        'buildingId.admins',
        'buildingId.apartments',
        'buildingId.apartments.userId',
      ],
    });

    if (!bill) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }

    // Ordenar expenses alfabéticamente por expense.name
    bill.expenses.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a debe ir antes que b
      }
      if (a.name > b.name) {
        return 1; // b debe ir antes que a
      }
      return 0; // son iguales
    });

    const { buildingId } = bill;

    const apartment = buildingId.apartments.find(
      (apartment) => apartment.userId?.id === userId,
    );
    const owner = apartment
      ? apartment?.userId
      : buildingId.admins.find((admin) => admin.id === userId);

    return {
      bill,
      apartment,
      owner,
    };
  }

  async findOneByUuid(uuid: string) {
    const bill = await this.billRepo.findOne({
      where: { uuid: uuid, isRemoved: false },
      relations: ['buildingId', 'expenses'],
    });
    if (!bill) {
      throw new NotFoundException(`Building Bill #${uuid} not found`);
    }
    return bill;
  }

  async findOne(id: number) {
    const bill = await this.billRepo.findOne({
      where: { id: id, isRemoved: false },
      relations: ['buildingId', 'userId', 'expenses', 'individualBills'],
    });
    if (!bill) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }
    return bill;
  }

  async create(
    payload: CreateBuildingBillDTO,
    userId: number,
    buildingId: number,
  ) {
    try {
      const newBill = this.billRepo.create({
        ...payload,
        userId: { id: userId },
        buildingId: { id: buildingId },
        uuid: uuidv4(),
      });
      await this.billRepo.save(newBill);
      return newBill;
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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

  async updateBalance(id: number, balance: number) {
    const bill = await this.findOne(id);
    try {
      await this.billRepo.merge(bill, {
        balance: parseFloat(bill.balance.toString()) + balance,
        isPaid:
          parseFloat(bill.balance.toString()) + balance === bill.total
            ? true
            : false,
      });
      await this.billRepo.save(bill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  async updateByAdmin(id: number, payload: UpdateBuildingBillDTO) {
    const buildingBill = await this.findOne(id);
    try {
      await this.billRepo.merge(buildingBill, payload);
      await this.billRepo.save(buildingBill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return buildingBill;
  }

  delete(id: number) {
    return this.billRepo.delete(id);
  }

  async deleteByAdmin(id: number, userId: number) {
    const bill = await this.findOne(id);
    if (bill.userId.id != userId || bill.isPublished === true) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }
    try {
      this.billRepo.merge(bill, { isRemoved: true });
      await this.billRepo.save(bill);
      const expenses = await this.expenseService.findAllByBuilding(
        bill.buildingId.id,
      );
      expenses.forEach(async () => {
        await this.expenseRepo.update(
          {
            buildingBill: { id: bill.id },
          },
          {
            buildingBill: null,
          },
        );
      });
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  async setToPublished(uuid: string) {
    const bill = await this.findOneByUuid(uuid);
    const building = await this.buildingService.findOne(bill.buildingId.id);
    const nApartments = building.nApartments;
    let totalPerShare = 0;
    let totalNotPerShare = 0;
    bill.expenses.forEach((expense) => {
      if (expense.dependsOnShare) {
        const gasto = expense.total.toString();
        totalPerShare = totalPerShare + parseFloat(gasto);
      } else {
        totalNotPerShare = totalNotPerShare + expense.total / nApartments;
      }
    });
    (await building).apartments.forEach((Apartment) => {
      const payload: IndividualBillDto = {
        buildingBillId: bill,
        apartmentId: Apartment,
        Total: totalPerShare * Apartment.share + totalNotPerShare,
        Name: bill.name,
        Description: bill.description,
        IsPaid: false,
        Balance: 0,
        isRemoved: false,
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
      await this.billRepo.merge(bill, {
        isPublished: true,
        createdAt: new Date(),
      });
      await this.billRepo.save(bill);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bill;
  }

  async buildingDebt(buildingId: number) {
    const bills = await this.billRepo.find({
      where: {
        buildingId: { id: buildingId },
        isPublished: true,
        isRemoved: false,
      },
    });
    const debt = bills.reduce((acc, bill) => {
      return acc + (Number(bill.total) - Number(bill.balance));
    }, 0);
    return (debt * -1).toFixed(2);
  }
}
