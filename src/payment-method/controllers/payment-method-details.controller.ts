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
import { PaymentMethodDetailsService } from '../services/payment-method-details.service';
import {
  PaymentMethodDetailsDto,
  UpdatePaymentMethodDetailsDto,
} from '../dtos/payment-method-details.dto';

@Controller('payment-method-details')
export class PaymentMethodDetailsController {
  constructor(private paymentMethodDetails: PaymentMethodDetailsService) {}

  @Get()
  findAll() {
    return this.paymentMethodDetails.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodDetails.findOne(id);
  }

  @Post()
  create(@Body() payload: PaymentMethodDetailsDto) {
    return this.paymentMethodDetails.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodDetailsDto,
  ) {
    return this.paymentMethodDetails.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodDetails.remove(id);
  }
}
