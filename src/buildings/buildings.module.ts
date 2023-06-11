import { Module } from '@nestjs/common';
import { BuildingsController } from './controllers/buildings.controller';
import { BuildingsService } from './services/buildings.service';
import { ApartmentController } from './controllers/apartment.controller';
import { ApartmentsService } from './services/apartments.service';
import { AdminsService } from './services/admins.service';
import { AdminsController } from './controllers/admins.controller';
import { UsersModule } from 'src/users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Apartment } from './entities/apartment.entity';
import { User } from 'src/users/entities/User.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Building, Apartment, User])],
  controllers: [BuildingsController, ApartmentController, AdminsController],
  providers: [BuildingsService, ApartmentsService, AdminsService],
})
export class BuildingsModule {}
