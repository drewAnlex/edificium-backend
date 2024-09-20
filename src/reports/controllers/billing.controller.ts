import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BillingService } from '../services/billing.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get('building-bill/:id')
  async buildingBill(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res,
  ): Promise<void> {
    const user = req.user as any;
    const buffer = await this.billingService.generateBillPDF(id, user.userId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; file-name.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
