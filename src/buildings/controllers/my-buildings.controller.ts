import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import { FilterBuildingsDto, UpdateBuildingDto } from '../dtos/building.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('my-buildings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-buildings')
export class MyBuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getMyBuildings(@Query() params: FilterBuildingsDto) {
    return this.buildingsService.findAll(params);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get(':id')
  getBuilding(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as any;
    return this.buildingsService.findOneByOwner(id, user.userId);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  updateBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(id, payload);
  }

  @Roles('Admin')
  @Put('assign/:uuid')
  assignBuilding(@Param('uuid') uuid: string, @Req() req: Request) {
    const user = req.user as any;
    return this.buildingsService.setBuildingAdmin(uuid, user.userId);
  }
}
