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
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Roles('Staff')
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  create(@Body() payload: CreateServiceDTO) {
    return this.servicesService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServiceDTO,
  ) {
    return this.servicesService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
