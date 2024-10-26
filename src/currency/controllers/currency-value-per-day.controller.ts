import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrencyValuePerDayService } from '../services/currency-value-per-day.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ValuePerDayDto } from '../dtos/valuePerDay.dto';

@ApiTags('Currency Value')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('currency-value')
export class CurrencyValuePerDayController {
  constructor(private currencyValuePerDayService: CurrencyValuePerDayService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get('/latest/:currency')
  getLatestValue(@Param('currency', ParseIntPipe) currency: number) {
    return this.currencyValuePerDayService.getLatestValue(currency);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('/:date/:currency')
  findByDate(
    @Param('date') date: string,
    @Param('currency', ParseIntPipe) currency: number,
  ) {
    return this.currencyValuePerDayService.findByDate(date, currency);
  }

  @Roles('Staff')
  @Post()
  createValuePerDay(@Body() payload: ValuePerDayDto) {
    return this.currencyValuePerDayService.create(payload);
  }
}
