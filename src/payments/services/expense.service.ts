import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../dtos/Expense.dto';
import { Expense } from '../entities/Expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async findAll() {
    return this.expenseRepo.find();
  }

  async findOne(id: number) {
    const expense = this.expenseRepo.findOne({
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
      relations: ['buildingBill'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return expense;
  }

  async findAllByBuilding(building: number) {
    const expenses = await this.expenseRepo.find({
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
      ],
      relations: ['buildingBill'],
    });
    if (!expenses) {
      throw new NotFoundException(
        `Expenses in building #${building} not found`,
      );
    }
    return expenses.filter(
      (expense) =>
        (expense.buildingBill && expense.buildingBill.isRemoved === false) ||
        (expense.buildingBill === null && expense.isRemoved === false),
    );
  }

  async findUnpaidsByBuilding(building: number) {
    const expenses = this.expenseRepo.find({
      where: {
        building: { id: building },
        isPaid: false,
        isRemoved: false,
        buildingBill: { isRemoved: false },
      },
      relations: ['buildingBill'],
    });
    if (!expenses) {
      throw new NotFoundException(
        `Expenses in building #${building} not found`,
      );
    }
    return expenses;
  }

  async findPaidsByBuilding(building: number) {
    const expenses = this.expenseRepo.find({
      where: {
        building: { id: building },
        isPaid: true,
        isRemoved: false,
        buildingBill: { isRemoved: false },
      },
      relations: ['buildingBill'],
    });
    if (!expenses) {
      throw new NotFoundException(
        `Expenses in building #${building} not found`,
      );
    }
    return expenses;
  }

  async create(payload: CreateExpenseDTO) {
    const newExpense = this.expenseRepo.create(payload);
    try {
      await this.expenseRepo.save(newExpense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newExpense;
  }

  async update(payload: UpdateExpenseDTO, id: number) {
    const expense = await this.findOne(id);
    try {
      this.expenseRepo.merge(expense, payload);
      await this.expenseRepo.save(expense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return expense;
  }

  async delete(id: number) {
    const expense = await this.findOne(id);
    if (expense.buildingBill != null)
      throw new HttpException(
        `Recibo asociado existente`,
        HttpStatus.BAD_REQUEST,
      );
    try {
      this.expenseRepo.merge(expense, { isRemoved: true });
      await this.expenseRepo.save(expense);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return expense;
  }
}
