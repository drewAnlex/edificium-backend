import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Body,
  Param,
} from '@nestjs/common';
import { PaymentInfoService } from '../services/payment-info.service';
import { PaymentInfoDto, UpdatePaymentInfoDto } from '../dtos/payment-info.dto';

@Controller('payment-info')
export class PaymentInfoController {
  constructor(private paymentInfoService: PaymentInfoService) {}

  @Get()
  findAll() {
    return this.paymentInfoService.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentInfoService.findOne(id);
  }

  @Get('payment/:paymentId')
  getByPaymentId(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentInfoService.findByPaymentId(paymentId);
  }

  @Post()
  create(@Body() payload: PaymentInfoDto) {
    return this.paymentInfoService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentInfoDto,
  ) {
    return this.paymentInfoService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentInfoService.remove(+id);
  }
}
