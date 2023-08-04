import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import {
  CreateBuildingDto,
  FilterBuildingsDto,
  UpdateBuildingDto,
} from '../dtos/building.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Get()
  getBuildings(@Query() params: FilterBuildingsDto) {
    return this.buildingsService.findAll(params);
  }

  @Get(':id')
  getBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.findOne(id);
  }

  @Post()
  createBuilding(@Body() payload: CreateBuildingDto) {
    return this.buildingsService.create(payload);
  }

  @Put(':id')
  updateBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(id, payload);
  }

  @Delete(':id')
  deleteBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.remove(id);
  }
}
