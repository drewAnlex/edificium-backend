import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';
import { PaymentsService } from '../services/payments.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Roles('Staff')
  @Get()
  getPayments() {
    return this.paymentService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Roles('Staff', 'User', 'Admin')
  @Post()
  createPayment(@Body() data: PaymentDTO) {
    return this.paymentService.create(data);
  }

  @Roles('Staff')
  @Put(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: PaymentUpdateDTO,
  ) {
    return this.paymentService.update(id, changes);
  }

  @Roles('Staff')
  @Delete(':id')
  deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }

  @Roles('Staff')
  @Put(':id/status')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('Status') status: number,
  ) {
    return this.paymentService.updateStatus(id, status);
  }
}
