import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController]
})
export class PaymentsModule {}
