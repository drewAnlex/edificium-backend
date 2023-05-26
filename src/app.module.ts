import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsController } from './buildings/buildings.controller';
import { BuildingsService } from './buildings/buildings.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [AppController, BuildingsController, UsersController],
  providers: [AppService, BuildingsService, UsersService],
})
export class AppModule {}
