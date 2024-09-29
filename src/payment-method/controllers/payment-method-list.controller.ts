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
import { PaymentMethodListService } from '../services/payment-method-list.service';
import {
  PaymentMethodListDto,
  PartialPaymentMethodListDto,
} from '../dtos/payment-method-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('payment-method-list')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method-list')
export class PaymentMethodListController {
  constructor(
    private readonly paymentMethodListService: PaymentMethodListService,
  ) {}

  @Roles('Staff')
  @Get()
  findAll() {
    return this.paymentMethodListService.findAll();
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('building/:id')
  getByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.findByBuilding(id);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('individual/:id')
  getByIndividualBill(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.findByIndividualBill(id);
  }

  @Roles('Staff')
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  create(@Body() payload: PaymentMethodListDto) {
    return this.paymentMethodListService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PartialPaymentMethodListDto,
  ) {
    return this.paymentMethodListService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodListService.remove(id);
  }
}
