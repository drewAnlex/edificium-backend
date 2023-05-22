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
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from '../dtos/building.dto';

@Controller('buildings')
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Get()
  getBuildings(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('name') name: string,
    @Query('country') country: string,
    @Query('state') state: string,
    @Query('city') city: string,
    @Query('zone') zone: string,
    @Query('nApartments') nApartments = 100,
  ) {
    return this.buildingsService.findAll();
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
  updateBuilding(@Param('id', ParseIntPipe) id: number, @Body() payload: any) {
    return this.buildingsService.update(id, payload);
  }

  @Delete(':id')
  deleteBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.remove(id);
  }
}
