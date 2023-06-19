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

import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos/Supplier.dto';
import { SupplierService } from '../services/supplier.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  getAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateSupplierDTO) {
    return this.supplierService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSupplierDTO,
  ) {
    return this.supplierService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.delete(id);
  }
}
