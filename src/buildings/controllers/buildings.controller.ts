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
  UseGuards,
} from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import {
  CreateBuildingDto,
  FilterBuildingsDto,
  UpdateBuildingDto,
} from '../dtos/building.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('buildings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('buildings')
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Roles('Staff')
  @Get()
  getBuildings(@Query() params: FilterBuildingsDto) {
    return this.buildingsService.findAll(params);
  }

  @Roles('Staff')
  @Get(':id')
  getBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  createBuilding(@Body() payload: CreateBuildingDto) {
    return this.buildingsService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  updateBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  deleteBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.remove(id);
  }

  @Put('assign/:uuid/:adminId')
  assignBuilding(
    @Param('uuid') uuid: string,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.buildingsService.setBuildingAdmin(uuid, adminId);
  }
}
