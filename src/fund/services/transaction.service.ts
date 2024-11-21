import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/Transaction.entity';
import { Repository } from 'typeorm';
import { FundService } from './fund.service';
import { TransactionDTO, UpdateTransactionDTO } from '../dtos/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private fundService: FundService,
  ) {}

  findAll() {
    return this.transactionRepo.find();
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepo.findOne({
      where: { id: id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return transaction;
  }

  async findByFund(fundId: number) {
    const transactions = await this.transactionRepo.find({
      where: { fund: { id: fundId } },
    });
    if (!transactions) {
      throw new NotFoundException(`Transactions for fund #${fundId} not found`);
    }
    return transactions;
  }

  async create(payload: TransactionDTO) {
    const fund = await this.fundService.findOne(
      parseInt(payload.fund.toString()),
    );
    try {
      const transaction = this.transactionRepo.create(payload);
      await this.transactionRepo.save(transaction);
      const newBalance =
        parseFloat(fund.balance.toString()) +
        parseFloat(payload.amount.toString());
      await this.fundService.updateBalance(fund.id, newBalance);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, payload: UpdateTransactionDTO) {
    try {
      const transaction = await this.findOne(id);
      this.transactionRepo.merge(transaction, payload);
      return await this.transactionRepo.save(transaction);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
