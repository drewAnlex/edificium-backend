import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currencyValuePerDay } from '../entities/currency-value-per-day.entity';
import { Between, Repository } from 'typeorm';
import { ValuePerDayDto } from '../dtos/valuePerDay.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CurrencyValuePerDayService {
  constructor(
    @InjectRepository(currencyValuePerDay)
    private valuePerDayRepo: Repository<currencyValuePerDay>,
  ) {}

  async convertToCurrencyAtDate(currency: number, value: number, date: string) {
    const currencyValue = await this.findByDate(date, currency);
    return value * currencyValue.value;
  }

  async convertToCurrency(currency: number, value: number) {
    const currencyValue = await this.getLatestValue(currency);
    return value * currencyValue.value;
  }

  async getLatestValue(currency: number) {
    const value = await this.valuePerDayRepo.findOne({
      where: {
        currency: { id: currency },
      },
      order: { createdAt: 'DESC' },
    });
    if (!value) {
      throw new HttpException(
        `Value for currency ${currency} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return value;
  }

  async findByDate(date: string, currency: number) {
    const targetDate = new Date(date);
    const startDate = new Date(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      0,
      0,
      0,
    );
    const endDate = new Date(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      23,
      59,
      59,
      999,
    );

    const value = await this.valuePerDayRepo.findOne({
      where: {
        createdAt: Between(startDate, endDate),
        currency: { id: currency },
      },
    });

    if (!value) {
      throw new HttpException(
        `Value for currency ${currency} and date ${date} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return value;
  }

  async create(payload: ValuePerDayDto) {
    const newValue = this.valuePerDayRepo.create(payload);
    try {
      await this.valuePerDayRepo.save(newValue);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newValue;
  }
  @Cron('10 0 * * 1-5', { timeZone: 'America/Caracas' })
  async getCurrencyValueBCV() {
    try {
      const response = await fetch(
        'https://pydolarve.org/api/v1/dollar?page=bcv',
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      const newValue = this.valuePerDayRepo.create({
        currency: { id: 1 },
        value: data.monitors.usd,
      });
      await this.valuePerDayRepo.save(newValue);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
