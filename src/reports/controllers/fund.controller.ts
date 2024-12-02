import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FundService } from '../services/fund.service';

@ApiTags('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fund-report')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get('details/:id')
  async buildingBill(
    @Param('id', ParseIntPipe) id: number,
    @Res() res,
  ): Promise<void> {
    const buffer = await this.fundService.fundStatement(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; file-name.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
