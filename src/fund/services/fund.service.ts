import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fund } from '../entities/Fund.entity';
import { FundDTO, UpdateFundDTO } from '../dtos/fund.dto';

@Injectable()
export class FundService {
  constructor(
    @InjectRepository(Fund)
    private fundRepo: Repository<Fund>,
  ) {}

  findAll() {
    return this.fundRepo.find();
  }

  async findOne(id: number) {
    const fund = await this.fundRepo.findOne({
      where: { id: id },
      relations: ['transactions', 'building'],
    });
    if (!fund) {
      throw new NotFoundException(`Fund #${id} not found`);
    }
    fund.transactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return fund;
  }

  async findByBuilding(buildingId: number) {
    const funds = await this.fundRepo.find({
      where: { building: { id: buildingId } },
    });
    if (!funds) {
      throw new NotFoundException(
        `Funds for building #${buildingId} not found`,
      );
    }
    return funds;
  }

  async create(payload: FundDTO) {
    try {
      const fund = this.fundRepo.create(payload);
      return await this.fundRepo.save(fund);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(id: number, payload: UpdateFundDTO) {
    try {
      const fund = await this.findOne(id);
      this.fundRepo.merge(fund, payload);
      return await this.fundRepo.save(fund);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateBalance(id: number, amount: number) {
    try {
      const fund = await this.findOne(id);
      this.fundRepo.merge(fund, { balance: amount });
      return await this.fundRepo.save(fund);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: number) {
    const fund = await this.findOne(id);
    this.fundRepo.merge(fund, { isRemoved: true });
    return await this.fundRepo.save(fund);
  }
}
