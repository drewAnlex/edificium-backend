import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TransactionDTO, UpdateTransactionDTO } from '../dtos/transaction.dto';

@ApiTags('Funds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fund-transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Roles('Staff')
  @Get()
  getTransactions() {
    return this.transactionService.findAll();
  }

  @Roles('Staff', 'Admin')
  @Get(':id')
  getTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(id);
  }

  @Roles('Staff', 'Admin')
  @Get('fund/:id')
  getTransactionsByFund(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findByFund(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  createTransaction(@Body() payload: TransactionDTO) {
    return this.transactionService.create(payload);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTransactionDTO,
  ) {
    return this.transactionService.update(id, payload);
  }
}
