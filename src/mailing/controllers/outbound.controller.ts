import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OutboundService } from '../services/outbound.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('outbound')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('outbound')
export class OutboundController {
  constructor(private outbound: OutboundService) {}

  @Roles('Staff', 'Admin')
  @Get('debt-reminder/:id')
  sendReminder(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    this.outbound.buildingBillEmail(id, user.userId);
    return { msg: 'Reminder sended' };
  }

  @Public()
  @Get('reset-password/:email')
  sendPasswordResetEmail(@Param('email') email: string) {
    return this.outbound.sendPasswordResetEmail(email);
  }
}
