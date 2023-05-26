import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsController } from './buildings/controllers/buildings.controller';
import { BuildingsService } from './buildings/services/buildings.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { BuildingsModule } from './buildings/buildings.module';

@Module({
  imports: [BuildingsModule],
  controllers: [AppController, BuildingsController, UsersController],
  providers: [AppService, BuildingsService, UsersService],
})
export class AppModule {}
