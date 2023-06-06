import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Body,
  Param,
} from '@nestjs/common';
import { IndividualBillsService } from '../services/individual-bills.service';
import {
  IndividualBillDto,
  UpdateIndividualBillDto,
} from '../dtos/IndividualBill.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('individual-bills')
@Controller('individual-bills')
export class IndividualBillsController {
  constructor(
    private readonly individualBillsService: IndividualBillsService,
  ) {}

  @Get()
  findAll() {
    return this.individualBillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.findOne(id);
  }

  @Post()
  create(@Body() data: IndividualBillDto) {
    return this.individualBillsService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateIndividualBillDto,
  ) {
    return this.individualBillsService.update(id, changes);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.remove(id);
  }
}
