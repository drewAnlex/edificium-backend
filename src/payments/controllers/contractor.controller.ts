import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ContractorService } from '../services/contractor.service';
import {
  CreateContractorDTO,
  UpdateContractorDTO,
} from '../dtos/contractor.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('contractor')
@Controller('contractor')
export class ContractorController {
  constructor(private contractorService: ContractorService) {}

  @Get()
  getAll() {
    return this.contractorService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractorService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateContractorDTO) {
    return this.contractorService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateContractorDTO,
  ) {
    return this.contractorService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contractorService.delete(id);
  }
}
