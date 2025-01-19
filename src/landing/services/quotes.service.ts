import { Injectable } from '@nestjs/common';
import { Quote } from '../entities/Quote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuoteDto } from '../dtos/quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote) private buildingRepo: Repository<Quote>,
  ) {}

  async createQuote(
    createQuoteDto: CreateQuoteDto,
  ): Promise<{ message: string; quote: Quote }> {
    try {
      const newQuote = this.buildingRepo.create(createQuoteDto);
      const savedQuote = await this.buildingRepo.save(newQuote);
      return {
        message: 'Quote created successfully',
        quote: savedQuote,
      };
    } catch (error) {
      throw new Error(`Failed to create quote: ${error.message}`);
    }
  }
}
