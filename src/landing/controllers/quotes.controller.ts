import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { QuotesService } from '../services/quotes.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateQuoteDto } from '../dtos/quote.dto';

@ApiTags('landing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService) {}

  @Public()
  @Post()
  async createQuote(@Body() quote: CreateQuoteDto) {
    return await this.quoteService.createQuote(quote);
  }
}
