import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currencyList } from '../entities/currency-list.entity';
import { Repository } from 'typeorm';
import { CurrencyDto, UpdateCurrencyDto } from '../dtos/currency.dto';

@Injectable()
export class CurrencyListService {
  constructor(
    @InjectRepository(currencyList)
    private currencyRepo: Repository<currencyList>,
  ) {}
  findAll() {
    return this.currencyRepo.find();
  }

  async findOne(id: number) {
    const currency = await this.currencyRepo.findOne({
      where: { id: id },
      relations: ['values'],
    });
    if (!currency) {
      throw new NotFoundException(`Currency #${id} not found`);
    }
    return currency;
  }

  async findByName(name: string) {
    const currency = await this.currencyRepo.findOne({
      where: { name: name },
      relations: ['values'],
    });
    if (!currency) {
      throw new NotFoundException(`Currency ${name} not found`);
    }
    return currency;
  }

  async create(payload: CurrencyDto) {
    const currency = this.currencyRepo.create(payload);
    return await this.currencyRepo.save(currency);
  }

  async update(id: number, payload: UpdateCurrencyDto) {
    const currency = await this.findOne(id);
    this.currencyRepo.merge(currency, payload);
    return await this.currencyRepo.save(currency);
  }

  async remove(id: number) {
    const currency = await this.findOne(id);
    return await this.currencyRepo.remove(currency);
  }
}
