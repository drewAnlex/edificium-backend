import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApartmentsService } from '../services/apartments.service';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('apartments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('apartments')
export class ApartmentController {
  constructor(private apartmentsService: ApartmentsService) {}

  @Roles('Staff')
  @Get()
  getApartments() {
    return this.apartmentsService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getAparment(@Param('id', ParseIntPipe) id: number) {
    return this.apartmentsService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  createAparment(@Body() payload: CreateAparmentDTO) {
    return this.apartmentsService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  updateAparment(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateAparmentDTO,
  ) {
    return this.apartmentsService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  deleteAparment(@Param('id', ParseIntPipe) id: number) {
    return this.apartmentsService.remove(id);
  }

  @Roles('Staff')
  @Put('/assign/:uuid/:userId')
  assignApartmentToUser(
    @Param('uuid') uuid: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.apartmentsService.setApartmentToUser(uuid, userId);
  }
}
