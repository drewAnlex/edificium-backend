import { Module } from '@nestjs/common';
import { MailingModule } from '../mailing/mailing.module';
import { OutboundService } from '../mailing/services/outbound.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Role } from './entities/Role.entity';
import { User } from './entities/User.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [MailingModule, TypeOrmModule.forFeature([Role, User])],
  controllers: [UsersController, RolesController, ProfileController],
  providers: [UsersService, RolesService, OutboundService],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
