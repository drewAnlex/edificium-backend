import { Module } from '@nestjs/common';
import { BuildingsController } from './controllers/buildings.controller';
import { BuildingsService } from './services/buildings.service';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
