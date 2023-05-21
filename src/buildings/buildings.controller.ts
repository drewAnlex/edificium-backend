import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';

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
    @Query('nApartments') nApartments: number,
  ) {
    return this.buildingsService.findAll();
  }

  @Get(':id')
  getBuilding(@Param('id') id: number) {
    return this.buildingsService.findOne(id);
  }

  @Post()
  createBuilding(@Body() payload: any) {
    return this.buildingsService.create(payload);
  }

  @Put(':id')
  updateBuilding(@Param('id') id: number, @Body() payload: any) {
    return this.buildingsService.update(id, payload);
  }

  @Delete(':id')
  deleteBuilding(@Param('id') id: number) {
    return this.buildingsService.remove(id);
  }
}
