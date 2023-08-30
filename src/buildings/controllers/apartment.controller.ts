import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApartmentsService } from '../services/apartments.service';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private apartmentsService: ApartmentsService) {}

  @Get()
  getApartments() {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  getAparment(@Param('id', ParseIntPipe) id: number) {
    return this.apartmentsService.findOne(id);
  }

  @Post()
  createAparment(@Body() payload: CreateAparmentDTO) {
    return this.apartmentsService.create(payload);
  }

  @Put(':id')
  updateAparment(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateAparmentDTO,
  ) {
    return this.apartmentsService.update(id, payload);
  }

  @Delete(':id')
  deleteAparment(@Param('id', ParseIntPipe) id: number) {
    return this.apartmentsService.remove(id);
  }

  @Put('/assign/:uuid/:userId')
  assignApartmentToUser(
    @Param('uuid') uuid: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.apartmentsService.setApartmentToUser(uuid, userId);
  }
}
