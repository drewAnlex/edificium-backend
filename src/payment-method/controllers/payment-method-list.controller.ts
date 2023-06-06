import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentMethodListService } from '../services/payment-method-list.service';
import {
  PaymentMethodListDto,
  PartialPaymentMethodListDto,
} from '../dtos/payment-method-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment-method-list')
@Controller('payment-method-list')
export class PaymentMethodListController {
  constructor(
    private readonly paymentMethodListService: PaymentMethodListService,
  ) {}

  @Get()
  findAll() {
    return this.paymentMethodListService.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.findOne(id);
  }

  @Post()
  create(@Body() payload: PaymentMethodListDto) {
    return this.paymentMethodListService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PartialPaymentMethodListDto,
  ) {
    return this.paymentMethodListService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.remove(id);
  }
}
