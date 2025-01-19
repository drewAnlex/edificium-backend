import { Module } from '@nestjs/common';
import { QuotesController } from './controllers/quotes.controller';
import { QuotesService } from './services/quotes.service';
import { Quote } from './entities/Quote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class LandingModule {}
