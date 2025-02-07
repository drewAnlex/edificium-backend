import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { QuotesService } from '../services/quotes.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateQuoteDto } from '../dtos/quote.dto';
import { OutboundService } from 'src/mailing/services/outbound.service';

@ApiTags('landing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(
    private quoteService: QuotesService,
    private mailService: OutboundService,
  ) {}

  @Public()
  @Post()
  async createQuote(@Body() quote: CreateQuoteDto) {
    this.mailService.sendQuote('roadev01@gmail.com', quote);
    return await this.quoteService.createQuote(quote);
  }

  @Public()
  @Post('administradoramv')
  async createQuoteAdmin(@Body() quote: CreateQuoteDto) {
    this.mailService.sendQuote('mvresidencias@gmail.com', quote);
    this.mailService.sendQuote('roadev01@gmail.com', quote);
    return await this.quoteService.createQuote(quote);
  }
}
