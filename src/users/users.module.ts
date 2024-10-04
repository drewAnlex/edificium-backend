import { forwardRef, Module } from '@nestjs/common';
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
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { BillingService } from 'src/reports/services/billing.service';
import { ReportsModule } from 'src/reports/reports.module';
import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { BuildingsModule } from 'src/buildings/buildings.module';
import { IndividualBill } from 'src/payments/entities/IndividualBill.entity';
import { Building } from 'src/buildings/entities/building.entity';

@Module({
  imports: [
    MailingModule,
    PaymentsModule,
    forwardRef(() => ReportsModule),
    forwardRef(() => BuildingsModule),
    TypeOrmModule.forFeature([
      Role,
      User,
      BuildingBill,
      IndividualBill,
      Building,
    ]),
  ],
  controllers: [UsersController, RolesController, ProfileController],
  providers: [
    UsersService,
    RolesService,
    OutboundService,
    BuildingBillsService,
    IndividualBillsService,
    BillingService,
    BuildingsService,
  ],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
