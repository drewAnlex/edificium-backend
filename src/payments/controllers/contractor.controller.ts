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
  @Post()
  create(@Body() payload: CreateContractorDTO) {
    return this.contractorService.create(payload);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateContractorDTO,
  ) {
    return this.contractorService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contractorService.delete(id);
  }
}
