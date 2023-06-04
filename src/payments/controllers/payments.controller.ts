import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';
import { PaymentsService } from '../services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get()
  getPayments() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Post()
  createPayment(@Body() data: PaymentDTO) {
    return this.paymentService.create(data);
  }

  @Put(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: PaymentUpdateDTO,
  ) {
    return this.paymentService.update(id, changes);
  }

  @Delete(':id')
  deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
