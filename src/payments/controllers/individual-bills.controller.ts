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
import { IndividualBillsService } from '../services/individual-bills.service';
import {
  IndividualBillDto,
  UpdateIndividualBillDto,
} from '../dtos/IndividualBill.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('individual-bills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('individual-bills')
export class IndividualBillsController {
  constructor(
    private readonly individualBillsService: IndividualBillsService,
  ) {}

  @Roles('Staff')
  @Get()
  findAll() {
    return this.individualBillsService.findAll();
  }

  @Roles('Staff')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.findOne(id);
  }

  @Roles('Staff')
  @Post()
  create(@Body() data: IndividualBillDto) {
    return this.individualBillsService.create(data);
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateIndividualBillDto,
  ) {
    return this.individualBillsService.update(id, changes);
  }

  @Roles('Staff')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.remove(id);
  }
}
