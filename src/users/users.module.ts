import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [UsersController, RolesController, ProfileController],
  providers: [UsersService, RolesService],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
