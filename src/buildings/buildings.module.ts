import { Module } from '@nestjs/common';
import { BuildingsController } from './controllers/buildings.controller';
import { BuildingsService } from './services/buildings.service';
import { ApartmentController } from './controllers/apartment.controller';
import { ApartmentsService } from './services/apartments.service';
import { UsersModule } from 'src/users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Apartment } from './entities/apartment.entity';
import { User } from 'src/users/entities/User.entity';
import { UsersService } from 'src/users/services/users.service';
import { MyApartmentsController } from './controllers/my-apartments.controller';
import { MyBuildingsController } from './controllers/my-buildings.controller';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  imports: [
    UsersModule,
    MailingModule,
    TypeOrmModule.forFeature([Building, Apartment, User]),
  ],
  controllers: [
    BuildingsController,
    ApartmentController,
    MyApartmentsController,
    MyBuildingsController,
  ],
  providers: [BuildingsService, ApartmentsService, UsersService],
  exports: [BuildingsService, ApartmentsService],
})
export class BuildingsModule {}
