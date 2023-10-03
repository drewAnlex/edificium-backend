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
} from '@nestjs/common';
import { ContractorService } from '../services/contractor.service';
import {
  CreateContractorDTO,
  UpdateContractorDTO,
} from '../dtos/contractor.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('contractor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contractor')
export class ContractorController {
  constructor(private contractorService: ContractorService) {}

  @Roles('Staff')
  @Get()
  getAll() {
    return this.contractorService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractorService.findOne(id);
  }

  @Roles('Staff')
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) buildingId: number,
    @Body() payload: CreateContractorDTO,
  ) {
    return this.contractorService.create(payload, buildingId);
  }

  @Roles('Staff')
  @Put(':id/:buldingId')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('buldingId', ParseIntPipe) buildingId: number,
    @Body() payload: UpdateContractorDTO,
  ) {
    return this.contractorService.update(id, payload, buildingId);
  }

  @Roles('Staff')
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Param('buldingId', ParseIntPipe) buildingId: number,
  ) {
    return this.contractorService.delete(id, buildingId);
  }
}
