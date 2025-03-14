import { Injectable } from '@nestjs/common';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';

@Injectable()
export class AuditService {
  constructor(private apartmentService: ApartmentsService) {}

  async generateDiscrepancyReport(discrepancies: any[]) {
    const pdfBuffer: Buffer = await new Promise<Buffer>(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: true,
      });

      // Encabezado
      doc
        .fontSize(18)
        .text('Reporte de Discrepancias Financieras', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .text(`Fecha de generación: ${new Date().toLocaleDateString()}`, {
          align: 'center',
        })
        .moveDown(1);

      // Detalles de discrepancias
      discrepancies.forEach((record, index) => {
        if (index > 0) doc.addPage();
        doc
          .fontSize(12)
          .fillColor('#333333')
          .text(
            `Apartamento: ${record.apartmentIdentifier} (ID: ${record.apartmentId})`,
            { underline: true },
          )
          .moveDown(0.3);

        // Tabla de datos
        const startY = doc.y;
        doc
          .font('Helvetica-Bold')
          .text('Concepto', 50, startY)
          .text('Valor', 300, startY)
          .moveDown(0.3);

        const data = [
          ['Balance Actual', `$${Number(record.currentBalance).toFixed(2)}`],
          ['Balance Esperado', `$${Number(record.expectedBalance).toFixed(2)}`],
          [
            'Total Facturas',
            `$${Number(record.individualBillsTotal).toFixed(2)}`,
          ],
          ['Total Pagos', `$${Number(record.paymentsTotal).toFixed(2)}`],
          [
            'Diferencia',
            `$${Number(
              Math.abs(record.expectedBalance - record.currentBalance),
            ).toFixed(2)}`,
          ],
        ];

        let y = doc.y;
        data.forEach(([label, value]) => {
          doc.font('Helvetica').text(label, 50, y).text(value, 300, y);
          y += 20;
        });

        // Razón de discrepancia
        doc
          .font('Helvetica-Bold')
          .fillColor('#cc0000')
          .text('Razón:', 50, y + 10)
          .font('Helvetica')
          .fillColor('#333333')
          .text(record.discrepancyReason, { width: 500, align: 'justify' })
          .moveDown(1.5);

        // Línea separadora
        doc
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .stroke()
          .moveDown(1);
      });

      // Pie de página
      const totalDiscrepancies = discrepancies.length;
      doc
        .fontSize(10)
        .fillColor('#666666')
        .text(
          `Total de discrepancias encontradas: ${totalDiscrepancies}`,
          50,
          doc.page.height - 50,
        );

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });
    return pdfBuffer;
  }
}
