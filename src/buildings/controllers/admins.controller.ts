import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';
import { CreateAdminDTO, UpdateAdminDTO } from '../dtos/admins.dto';
import { AdminsService } from '../services/admins.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.findOne(id);
  }

  @Get('building/:id')
  getByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.findByBuilding(id);
  }

  @Get('user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.findByUser(id);
  }

  @Post()
  create(@Body() payload: CreateAdminDTO) {
    return this.adminsService.setAdmin(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateAdminDTO,
  ) {
    return this.adminsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.remove(id);
  }
}
