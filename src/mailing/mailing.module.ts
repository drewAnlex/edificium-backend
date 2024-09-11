import { Module } from '@nestjs/common';
import { OutboundService } from './services/outbound.service';

@Module({
  providers: [OutboundService],
  exports: [OutboundService],
})
export class MailingModule {}
