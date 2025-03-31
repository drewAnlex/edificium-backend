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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IndividualExpensesService } from '../services/individual-expenses.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  CreateIndividualExpenseDTO,
  UpdateIndividualExpenseDTO,
} from '../dtos/IndividualExpense.dto';

@ApiTags('individual-expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('individual-expenses')
export class IndividualExpensesController {
  constructor(
    private readonly individualExpensesService: IndividualExpensesService,
  ) {}

  @Roles('Staff')
  @Get('all')
  findAll() {
    return this.individualExpensesService.findAll();
  }

  @Roles('Staff', 'Admin')
  @Get('building/:id')
  findAllByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.findAllByBuilding(id);
  }

  @Roles('Staff', 'Admin')
  @Get('apartment/:id')
  findAllByApartment(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.findAllByApartment(id);
  }

  @Roles('Staff', 'Admin')
  @Get('unpaids/:id')
  findUnpaids(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.findUnpaidsByBuilding(id);
  }

  @Roles('Staff', 'Admin')
  @Get('paids/:id')
  findPaids(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.findPaidsByBuilding(id);
  }

  @Roles('Staff', 'Admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.findOne(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  create(@Body() data: CreateIndividualExpenseDTO) {
    return this.individualExpensesService.create(data);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateIndividualExpenseDTO,
  ) {
    return this.individualExpensesService.update(data, id);
  }

  @Roles('Staff', 'Admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.individualExpensesService.delete(id);
  }
}
