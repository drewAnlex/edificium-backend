import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import { UpdateBuildingDto } from '../dtos/building.dto';
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

  @Roles('Staff', 'Admin')
  @Get('expenses/:id')
  getExpenses(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.getBuildingExpenses(id);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getMyBuildings(@Req() req: Request) {
    const user = req.user as any;
    return this.buildingsService.findMyBuildings(user.userId);
  }

  @Roles('Admin')
  @Get('my-admin')
  getBuildingByAdmin(@Req() req: Request) {
    const user = req.user as any;
    return this.buildingsService.findOne(user.building);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get(':id')
  getBuildingByOwner(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user as any;
    return this.buildingsService.findOneByOwner(id, user.userId);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('admin/:id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.buildingsService.findOneByRelation(id, user.id);
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
