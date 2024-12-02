import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FundService as FService } from 'src/fund/services/fund.service';
import PDFDocument from 'pdfkit-table';

const formatter = new Intl.DateTimeFormat('es-ES'); // 'es-ES' para español de España

@Injectable()
export class FundService {
  constructor(private fundService: FService) {}

  async fundStatement(fundId: number) {
    const fund = await this.fundService.findOne(fundId);
    const building = fund.building;
    const transactions = fund.transactions;
    const billTitle = building.billTitle ? building.billTitle : 'NEXIADMIN';
    const logoUrl = building.logoImg
      ? building.logoImg
      : 'http://67.205.149.177/images/icon.jpeg';
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    const nexiLogo = 'http://67.205.149.177/images/icon.jpeg';
    const responseNexi = await axios.get(nexiLogo, {
      responseType: 'arraybuffer',
    });
    const nexiLogoBuffer = responseNexi.data;
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: false,
      });
      doc.on('pageAdded', () => {
        const bottom = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text(
          'Generado por NexiAdmin',
          0.5 * (doc.page.width - 100),
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
            continued: true,
          },
        );
        doc.image(
          nexiLogoBuffer,
          0.5 * (doc.page.width - 20),
          doc.page.height - 25,
          {
            fit: [16, 16],
            align: 'center',
          },
        );

        // Reset text writer position

        doc.text('', 50, 50);
        doc.page.margins.bottom = bottom;
        doc.font('Helvetica').fontSize(10);

        // Building information in header
        doc.text(``, 50, 20);
        const adressOptions = {
          width: doc.page.width, // Adjust table width
          cellPadding: 5, // Add some padding to cells
          headerRows: 1, // Only show header row as bold
          columnsSize: [350],
          divider: {
            header: { disabled: true, width: 2, opacity: 1 },
            horizontal: { disabled: true, width: 0.5, opacity: 0.5 },
          },
        };
        const adressTable = {
          headers: [
            {
              label: `${building.name}, ${building.fiscalId}`,
              headerColor: 'white',
            },
          ],
          rows: [[building.zone]],
        };
        doc.table(adressTable, adressOptions);
        // doc.text(`${data.bill.buildingId.zone}`, 50, 35);
        doc.font('Helvetica-Bold').fontSize(18).fillColor('purple'); // Adjust font size and color

        doc.text(billTitle, doc.page.width - 220, 25, {
          align: 'left',
        });

        doc.image(imageBuffer, doc.page.width - 100, 5, {
          fit: [45, 45],
          align: 'center',
        });
        doc
          .moveTo(50, 55)
          .lineTo(doc.page.width - 50, 55)
          .stroke();

        doc.text('', 50, 70);
        doc.font('Helvetica').fontSize(10).fillColor('black');
      });

      doc.addPage();
      doc.text('', 50, 70);
      doc.font('Helvetica').fontSize(10);
      const tableOptions = {
        width: doc.page.width,
        layout: 'lightHorizontalLines',
        cellPadding: 3,
        headerRows: 1,
        columnsSize: [220, 175, 125],
      };

      const table = {
        title: fund.name,
        subtitle: `Balance actual: ${fund.balance}`,
        headers: ['Transacción', 'Monto', 'Fecha'],
        rows: [
          ...transactions.map((transaction) => {
            return [
              transaction.name,
              transaction.amount.toString(),
              `${formatter.format(transaction.createdAt)}`,
            ];
          }),
        ],
      };

      doc.table(table, tableOptions);
      doc.font('Helvetica-Bold').fontSize(10);

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
