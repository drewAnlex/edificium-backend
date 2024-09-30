import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentInfoService } from '../services/payment-info.service';
import { PaymentInfoDto, UpdatePaymentInfoDto } from '../dtos/payment-info.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('payment-info')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-info')
export class PaymentInfoController {
  constructor(private paymentInfoService: PaymentInfoService) {}

  @Roles('Staff')
  @Get()
  findAll() {
    return this.paymentInfoService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentInfoService.findOne(id);
  }

  @Roles('Staff')
  @Get('payment/:paymentId')
  getByPaymentId(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentInfoService.findByPaymentId(paymentId);
  }

  @Roles('Staff', 'Admin', 'User')
  @Post()
  create(@Body() payload: PaymentInfoDto) {
    return this.paymentInfoService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentInfoDto,
  ) {
    return this.paymentInfoService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentInfoService.remove(+id);
  }
}
