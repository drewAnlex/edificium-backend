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

import {
  CreateBuildingBillDTO,
  UpdateBuildingBillDTO,
} from '../dtos/BuildingBill.dto';

import { BuildingBillsService } from '../services/building-bills.service';

@Controller('building-bills')
export class BuildingBillsController {
  constructor(private buildingBillService: BuildingBillsService) {}

  @Get()
  getBills() {
    return this.buildingBillService.findAll();
  }

  @Get(':id')
  getBill(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateBuildingBillDTO) {
    return this.buildingBillService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingBillDTO,
  ) {
    return this.buildingBillService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.delete(id);
  }
}
