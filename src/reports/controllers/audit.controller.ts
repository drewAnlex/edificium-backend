import {
  Controller,
  Get,
  UseGuards,
  Res,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuditService } from '../services/audit.service';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private apartmentService: ApartmentsService,
  ) {}

  @Get('download-report/:buildingId')
  async downloadAuditReport(
    @Param('buildingId', ParseIntPipe) buildingId: number,
    @Res() res: Response,
  ) {
    try {
      const discrepancies = await this.apartmentService.auditBalances(
        buildingId,
      );

      if (!discrepancies.length) {
        return res.status(404).json({ message: 'No discrepancies found' });
      }

      const buffer: Buffer = await this.auditService.generateDiscrepancyReport(
        discrepancies,
      );

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit_report_${buildingId}_${Date.now()}.pdf"`,
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        message: 'Error generating audit report',
        error: error.message,
      });
    }
  }
}
