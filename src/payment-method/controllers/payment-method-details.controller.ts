import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodDetailsService } from '../services/payment-method-details.service';
import {
  PaymentMethodDetailsDto,
  UpdatePaymentMethodDetailsDto,
} from '../dtos/payment-method-details.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('payment-method-details')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method-details')
export class PaymentMethodDetailsController {
  constructor(private paymentMethodDetails: PaymentMethodDetailsService) {}

  @Roles('Staff')
  @Get()
  findAll() {
    return this.paymentMethodDetails.findAll();
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('method/:id')
  getByMethod(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodDetails.findOneByMethod(id);
  }

  @Roles('Staff')
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodDetails.findOne(id);
  }

  @Roles('Staff')
  @Post()
  create(@Body() payload: PaymentMethodDetailsDto) {
    return this.paymentMethodDetails.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodDetailsDto,
  ) {
    return this.paymentMethodDetails.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodDetails.remove(id);
  }
}
