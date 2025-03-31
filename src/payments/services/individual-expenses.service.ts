import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateIndividualExpenseDTO,
  UpdateIndividualExpenseDTO,
} from '../dtos/IndividualExpense.dto';
import { IndividualExpense } from '../entities/IndividualExpense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IndividualExpensesService {
  constructor(
    @InjectRepository(IndividualExpense)
    private individualExpenseRepo: Repository<IndividualExpense>,
  ) {}

  async findAll() {
    return this.individualExpenseRepo.find();
  }

  async findOne(id: number) {
    const individualExpense = this.individualExpenseRepo.findOne({
      where: [
        {
          id: id,
          isRemoved: false,
          buildingBill: { isRemoved: false },
        },
        {
          id: id,
          isRemoved: false,
        },
      ],
      relations: ['buildingBill', 'apartmentId'],
    });
    if (!individualExpense) {
      throw new NotFoundException(`Individual Expense #${id} not found`);
    }
    return individualExpense;
  }

  async findAllByBuildingBill(buildingBill: number) {
    const individualExpenses = await this.individualExpenseRepo.find({
      where: { buildingBill: { id: buildingBill } },
      relations: ['buildingBill', 'apartmentId'],
    });
    if (!individualExpenses) {
      throw new NotFoundException(
        `Individual Expenses for building bill #${buildingBill} not found`,
      );
    }
    return individualExpenses;
  }

  async findAllByBuilding(building: number) {
    const individualExpenses = await this.individualExpenseRepo.find({
      where: [
        {
          building: { id: building },
          isRemoved: false,
          buildingBill: { isRemoved: false },
        },
        {
          building: { id: building },
          isRemoved: false,
        },
        {
          building: { id: building },
          isRemoved: false,
          buildingBill: null,
        },
      ],
      relations: ['buildingBill', 'apartmentId'],
    });
    if (!individualExpenses) {
      throw new NotFoundException(
        `Individual Expenses in building #${building} not found`,
      );
    }
    return individualExpenses.filter(
      (individualExpense) =>
        (individualExpense.buildingBill &&
          individualExpense.buildingBill.isRemoved === false) ||
        (individualExpense.buildingBill === null &&
          individualExpense.isRemoved === false),
    );
  }

  async findAllByApartment(apartment: number) {
    const individualExpenses = await this.individualExpenseRepo.find({
      where: [
        {
          apartmentId: { id: apartment },
          isRemoved: false,
          buildingBill: { isRemoved: false },
        },
        {
          apartmentId: { id: apartment },
          isRemoved: false,
        },
      ],
      relations: ['buildingBill', 'apartmentId', 'building'],
    });
    if (!individualExpenses) {
      throw new NotFoundException(
        `Individual Expenses for apartment #${apartment} not found`,
      );
    }
    return individualExpenses;
  }

  async findUnpaidsByBuilding(building: number) {
    const individualExpenses = this.individualExpenseRepo.find({
      where: {
        building: { id: building },
        isPaid: false,
        isRemoved: false,
        buildingBill: { isRemoved: false },
      },
      relations: ['buildingBill', 'apartmentId'],
    });
    if (!individualExpenses) {
      throw new NotFoundException(
        `Individual Expenses in building #${building} not found`,
      );
    }
    return individualExpenses;
  }

  async findPaidsByBuilding(building: number) {
    const individualExpenses = this.individualExpenseRepo.find({
      where: {
        building: { id: building },
        isPaid: true,
        isRemoved: false,
        buildingBill: { isRemoved: false },
      },
      relations: ['buildingBill', 'apartmentId'],
    });
    if (!individualExpenses) {
      throw new NotFoundException(
        `Individual Expenses in building #${building} not found`,
      );
    }
    return individualExpenses;
  }

  async create(payload: CreateIndividualExpenseDTO) {
    const newIndividualExpense = this.individualExpenseRepo.create(payload);
    try {
      await this.individualExpenseRepo.save(newIndividualExpense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newIndividualExpense;
  }

  async update(payload: UpdateIndividualExpenseDTO, id: number) {
    const individualExpense = await this.findOne(id);
    try {
      this.individualExpenseRepo.merge(individualExpense, payload);
      await this.individualExpenseRepo.save(individualExpense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return individualExpense;
  }

  async delete(id: number) {
    const individualExpense = await this.findOne(id);
    if (individualExpense.buildingBill != null)
      throw new HttpException(
        `Recibo asociado existente`,
        HttpStatus.BAD_REQUEST,
      );
    try {
      this.individualExpenseRepo.merge(individualExpense, { isRemoved: true });
      await this.individualExpenseRepo.save(individualExpense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return individualExpense;
  }
}
