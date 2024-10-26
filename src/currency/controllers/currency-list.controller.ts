import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrencyListService } from '../services/currency-list.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrencyDto, UpdateCurrencyDto } from '../dtos/currency.dto';

@ApiTags('Currency')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('currency-list')
export class CurrencyListController {
  constructor(private currencyService: CurrencyListService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getCurrencyList() {
    return this.currencyService.findAll();
  }

  @Roles('Staff', 'Admin', 'User')
  @Get(':id')
  getCurrency(@Param('id', ParseIntPipe) id: number) {
    return this.currencyService.findOne(id);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('/name/:name')
  getCurrencyByName(@Param('name') name: string) {
    return this.currencyService.findByName(name);
  }

  @Roles('Staff')
  @Post()
  createCurrency(@Body() payload: CurrencyDto) {
    return this.currencyService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  updateCurrency(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  deleteCurrency(@Param('id', ParseIntPipe) id: number) {
    return this.currencyService.remove(id);
  }
}
