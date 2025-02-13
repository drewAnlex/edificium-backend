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
  Req,
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
import { Request } from 'express';

@ApiTags('my-building-bills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-building-bills')
export class MyBuildingBillsController {
  constructor(private buildingBillService: BuildingBillsService) {}

  @Roles('Admin', 'User', 'Staff')
  @Get('debt/:id')
  getDebt(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.buildingDebt(id);
  }

  @Roles('Admin')
  @Get('unpublished/:id')
  getUnpublished(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.isNotPublished(id);
  }

  @Roles('User', 'Admin')
  @Get('lastest/:id')
  getLatest(@Param('id', ParseIntPipe) id: number) {
    return this.buildingBillService.getLatest(id);
  }

  @Roles('Admin', 'User')
  @Get('bills/:id')
  getByOwner(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.buildingBillService.findByOwner(id, user.userId);
  }

  @Roles('Admin')
  @Get('uuid/:uuid')
  getBillByUuid(@Param('uuid') uuid: string) {
    return this.buildingBillService.findOneByUuid(uuid);
  }

  @Roles('Admin', 'User')
  @Get(':id')
  getBill(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.buildingBillService.findOneByOwner(id, user.userId);
  }

  @Roles('Admin')
  @Post(':id')
  create(
    @Body() payload: CreateBuildingBillDTO,
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user as any;
    return this.buildingBillService.create(payload, user.userId, id);
  }

  @Roles('Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBuildingBillDTO,
  ) {
    return this.buildingBillService.updateByAdmin(id, payload);
  }

  @Roles('Admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.buildingBillService.deleteByAdmin(id, user.userId);
  }

  @Roles('Admin')
  @Get('published/:uuid')
  setPublished(@Param('uuid') uuid: string) {
    return this.buildingBillService.setToPublished(uuid);
  }
}
