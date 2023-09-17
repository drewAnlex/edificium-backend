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
import { PaymentMethodsService } from '../services/payment-methods.service';
import {
  PaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/PaymentMethod.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('payment-methods')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Roles('Staff')
  @Get()
  getMany() {
    return this.paymentMethodsService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodsService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  create(@Body() data: PaymentMethodDto) {
    return this.paymentMethodsService.create(data);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(id, changes);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodsService.remove(id);
  }
}
