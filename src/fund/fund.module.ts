import { Module } from '@nestjs/common';
import { FundService } from './services/fund.service';
import { FundController } from './controllers/fund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fund } from './entities/Fund.entity';
import { Transaction } from './entities/Transaction.entity';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fund, Transaction])],
  providers: [FundService, TransactionService],
  controllers: [FundController, TransactionController],
})
export class FundModule {}
