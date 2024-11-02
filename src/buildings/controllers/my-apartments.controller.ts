import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApartmentsService } from '../services/apartments.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('apartments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-apartments')
export class MyApartmentsController {
  constructor(private apartmentsService: ApartmentsService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getApartmentsByOwner(@Req() req: Request) {
    const user = req.user as any;
    return this.apartmentsService.getApartmentsByOwner(user.userId);
  }

  @Roles('Admin')
  @Get('building/:id')
  getApartmentsByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.apartmentsService.getApartmentsByBuilding(id);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get(':id')
  getAparment(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as any;
    return this.apartmentsService.findOneByOwner(id, user.userId);
  }

  @Roles('Staff', 'Admin', 'User')
  @Put('/assign/:uuid')
  assignApartmentToUser(@Param('uuid') uuid: string, @Req() req: Request) {
    const user = req.user as any;
    return this.apartmentsService.setApartmentToUser(uuid, user.userId);
  }

  @Roles('Staff', 'Admin')
  @Get('admin/:id')
  getOneByAdmin(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.apartmentsService.findOneByAdmin(id, user.buildingId);
  }
}
