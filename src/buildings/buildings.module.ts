import { Module } from '@nestjs/common';
import { BuildingsController } from './controllers/buildings.controller';
import { BuildingsService } from './services/buildings.service';
import { ApartmentController } from './controllers/apartment.controller';
import { ApartmentsService } from './services/apartments.service';

@Module({
  controllers: [BuildingsController, ApartmentController],
  providers: [BuildingsService, ApartmentsService],
})
export class BuildingsModule {}
