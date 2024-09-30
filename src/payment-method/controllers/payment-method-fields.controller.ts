import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaymentMethodFieldsService } from '../services/payment-method-fields.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  PaymentMethodFieldDTO,
  UpdatePaymentMethodFieldDTO,
} from '../dtos/PaymentMethodFields.dto';

@ApiTags('payment-method-fields')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method-fields')
export class PaymentMethodFieldsController {
  constructor(private fieldService: PaymentMethodFieldsService) {}

  @Roles('Staff')
  @Get()
  getAll() {
    return this.fieldService.findAll();
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('method/:id')
  getByMethod(@Param('id', ParseIntPipe) id: number) {
    return this.fieldService.findByMethod(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  create(@Body() payload: PaymentMethodFieldDTO) {
    return this.fieldService.create(payload);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodFieldDTO,
  ) {
    return this.fieldService.update(payload, id);
  }

  @Roles('Staff', 'Admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.fieldService.delete(id);
  }
}
