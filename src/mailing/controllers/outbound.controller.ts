import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OutboundService } from '../services/outbound.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('outbound')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('outbound')
export class OutboundController {
  constructor(private outbound: OutboundService) {}

  @Roles('Staff', 'Admin')
  @Get('debt-reminder/:id')
  sendReminder(@Param('id', ParseIntPipe) id: number) {
    this.outbound.buildingBillEmail(id);
    return { msg: 'Reminder sended' };
  }
}
