import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/Service.dto';
import { ServicesService } from '../services/services.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-services')
export class MyServicesController {
  constructor(private servicesService: ServicesService) {}

  @Roles('Admin', 'User')
  @Get(':uuid')
  findAll(@Param('uuid') uuid: string) {
    return this.servicesService.findAllByBuildingBillId(uuid);
  }

  @Roles('Admin', 'User')
  @Get(':uuid/:id')
  get(@Param('id', ParseIntPipe) id: number, @Param('uuid') uuid: string) {
    return this.servicesService.findOneByBuildingBillId(id, uuid);
  }

  @Roles('Admin')
  @Post()
  create(@Body() payload: CreateServiceDTO) {
    return this.servicesService.create(payload);
  }

  @Roles('Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServiceDTO,
  ) {
    return this.servicesService.update(id, payload);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
