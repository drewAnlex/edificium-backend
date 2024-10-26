import { Module } from '@nestjs/common';
import { CurrencyListService } from './services/currency-list.service';
import { CurrencyListController } from './controllers/currency-list.controller';
import { currencyList } from './entities/currency-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { currencyValuePerDay } from './entities/currency-value-per-day.entity';
import { CurrencyValuePerDayService } from './services/currency-value-per-day.service';
import { CurrencyValuePerDayController } from './controllers/currency-value-per-day.controller';

@Module({
  imports: [TypeOrmModule.forFeature([currencyList, currencyValuePerDay])],
  providers: [CurrencyListService, CurrencyValuePerDayService],
  controllers: [CurrencyListController, CurrencyValuePerDayController],
})
export class CurrencyModule {}
