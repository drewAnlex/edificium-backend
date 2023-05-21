import { Controller, Get, Query, Param } from '@nestjs/common';

@Controller('buildings')
export class BuildingsController {
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
  ): string {
    return `All buildings ${limit} ${offset}`;
  }

  @Get(':id')
  getBuilding(@Param('id') id: number): string {
    return `Building ${id}`;
  }
}
