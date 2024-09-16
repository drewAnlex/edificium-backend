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
import { ExpenseService } from '../services/expense.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../dtos/Expense.dto';

@ApiTags('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Roles('Staff')
  @Get('all')
  findAll() {
    return this.expenseService.findAll();
  }

  @Roles('Staff', 'Admin')
  @Get('building/:id')
  findAllByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.findAllByBuilding(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  create(@Body() data: CreateExpenseDTO) {
    return this.expenseService.create(data);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateExpenseDTO,
  ) {
    return this.expenseService.update(data, id);
  }

  @Roles('Staff', 'Admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.delete(id);
  }
}
