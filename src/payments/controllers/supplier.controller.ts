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

import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos/Supplier.dto';
import { SupplierService } from '../services/supplier.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('supplier')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Roles('Staff')
  @Get()
  getAll() {
    return this.supplierService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  create(@Body() payload: CreateSupplierDTO) {
    return this.supplierService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSupplierDTO,
  ) {
    return this.supplierService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.delete(id);
  }
}
