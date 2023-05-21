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
  ) {
    return {
      buildings: [],
    };
  }

  @Get(':id')
  getBuilding(@Param('id') id: number) {
    return {
      id,
      name: 'Building name',
    };
  }

  @Post()
  createBuilding(@Body() payload: any) {
    return {
      payload,
      messsage: 'Building created',
    };
  }

  @Put(':id')
  updateBuilding(@Param('id') id: number, @Body() payload: any) {
    return {
      id,
      payload,
    };
  }
}
