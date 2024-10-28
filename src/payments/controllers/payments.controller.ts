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
  Req,
} from '@nestjs/common';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';
import { PaymentsService } from '../services/payments.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

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

  @Roles('User', 'Admin', 'Staff')
  @Get('user')
  getUserPayments(@Req() req: Request) {
    const user = req.user as any;
    return this.paymentService.findUserPayments(user.userId);
  }

  @Roles('Admin')
  @Get('building/:id')
  getBuildingPayments(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findBuildingPayments(id);
  }

  @Roles('Staff', 'Admin')
  @Get(':id')
  getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Roles('Staff', 'User', 'Admin')
  @Post()
  createPayment(@Body() data: PaymentDTO, @Req() req: Request) {
    const user = req.user as any;
    return this.paymentService.create(data, user.userId);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: PaymentUpdateDTO,
  ) {
    return this.paymentService.update(id, changes);
  }

  @Roles('Staff', 'Admin')
  @Delete(':id')
  deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }

  @Roles('Staff', 'Admin')
  @Put(':id/status')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('Status') status: number,
  ) {
    return this.paymentService.updateStatus(id, status);
  }
}
