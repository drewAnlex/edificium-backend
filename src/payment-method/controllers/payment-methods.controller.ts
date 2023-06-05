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
import { PaymentMethodsService } from '../services/payment-methods.service';
import {
  PaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/PaymentMethod.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Get()
  getMany() {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodsService.findOne(id);
  }

  @Post()
  create(@Body() data: PaymentMethodDto) {
    return this.paymentMethodsService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(id, changes);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodsService.remove(id);
  }
}
