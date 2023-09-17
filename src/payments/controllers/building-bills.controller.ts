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

import {
  CreateBuildingBillDTO,
  UpdateBuildingBillDTO,
} from '../dtos/BuildingBill.dto';

import { BuildingBillsService } from '../services/building-bills.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('building-bills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('building-bills')
export class BuildingBillsController {
  constructor(private buildingBillService: BuildingBillsService) {}

  @Roles('Staff')
  @Get()
  getBills() {
    return this.buildingBillService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getBill(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.findOne(id);
  }

  @Roles('Staff')
  @Get('uuid/:uuid')
  getBillByUuid(@Param('uuid') uuid: string) {
    return this.buildingBillService.findOneByUuid(uuid);
  }

  @Roles('Staff')
  @Post()
  create(@Body() payload: CreateBuildingBillDTO) {
    return this.buildingBillService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingBillDTO,
  ) {
    return this.buildingBillService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.delete(id);
  }

  @Roles('Staff')
  @Get('published/:uuid')
  setPublished(@Param('uuid') uuid: string) {
    return this.buildingBillService.setToPublished(uuid);
  }
}
