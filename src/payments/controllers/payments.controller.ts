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
  Query,
  DefaultValuePipe,
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

  @Roles('Admin', 'Staff')
  @Get('user/:id')
  getUserPaymentsById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findUserPayments(id);
  }

  @Roles('Admin', 'Condominium')
  @Get('building/:buildingId')
  async getBuildingPayments(
    @Param('buildingId', ParseIntPipe) buildingId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.findBuildingPayments(buildingId, {
      page,
      limit,
    });
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
  @Post('admin')
  createAdminPayment(@Body() data: PaymentDTO) {
    return this.paymentService.create(data, data.UserId.id);
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
  updatePaymentStatus(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.updateStatus(id, 1);
  }

  @Roles('Admin', 'Staff')
  @Get('apartment/:identifier')
  async getPaymentsByApartmentIdentifier(
    @Param('identifier') identifier: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.findPaymentsByApartmentIdentifier(identifier, {
      page,
      limit,
    });
  }
}
