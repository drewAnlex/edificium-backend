import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsController } from './buildings/buildings.controller';
import { BuildingsService } from './buildings/buildings.service';

@Module({
  imports: [],
  controllers: [AppController, BuildingsController],
  providers: [AppService, BuildingsService],
})
export class AppModule {}
