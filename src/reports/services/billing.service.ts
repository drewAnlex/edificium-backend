import { Injectable } from '@nestjs/common';
import axios from 'axios';
import PDFDocument from 'pdfkit-table';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';

const formatter = new Intl.DateTimeFormat('es-ES'); // 'es-ES' para español de España

@Injectable()
export class BillingService {
  constructor(
    private bbService: BuildingBillsService,
    private ibService: IndividualBillsService,
  ) {}
  async generateBillPDF(bill: number, user: number): Promise<Buffer> {
    const data = await this.bbService.findOneByOwner(bill, user);
    const individualBills = await this.ibService.findByApartment(
      data.apartment.id,
      data.owner.id,
    );
    const individualBill = individualBills.find(
      (billItem) => billItem.buildingBillId?.id === data.bill.id,
    );
    const pastIndividualBills = individualBills.filter((billItem) => {
      return (
        billItem.buildingBillId?.id !== data.bill.id &&
        billItem.IsPaid === false
      );
    });
    const totalGeneral = await this.ibService.adminIndividualDebt(
      data.apartment.id,
    );

    const logoUrl = 'http://67.205.149.177/images/icon.jpeg';
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: false,
      });

      let pageNumber = 0;
      doc.on('pageAdded', () => {
        pageNumber++;
        const bottom = doc.page.margins.bottom;

        doc.font('Helvetica').fontSize(10);

        // Building information in header
        doc.text(
          `${data.bill.buildingId.name}, ${data.bill.buildingId.fiscalId}`,
          50,
          20,
        );
        doc.text(
          `${data.bill.buildingId.city}, ${data.bill.buildingId.zone}`,
          50,
          35,
        );
        doc.font('Helvetica-Bold').fontSize(18).fillColor('purple'); // Adjust font size and color

        doc.text('NEXIADMIN', doc.page.width - 220, 25, { align: 'left' });

        doc.image(imageBuffer, doc.page.width - 100, 5, {
          fit: [45, 45],
          align: 'center',
        });
        doc
          .moveTo(50, 55)
          .lineTo(doc.page.width - 50, 55)
          .stroke();

        doc.page.margins.bottom = 0;
        doc.font('Helvetica').fontSize(14).fillColor('black');
        doc.text(
          'Pág. ' + pageNumber,
          0.5 * (doc.page.width - 100),
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
          },
        );
        doc.page.margins.bottom = bottom;
      });

      doc.addPage();
      doc.text('', 50, 70);
      doc.font('Helvetica').fontSize(10);
      doc.text(`Relación de gastos N°: ${data.bill.id}`);
      doc.text(`Propietario: ${data.owner.name}`);
      doc.text(
        `Inmueble: ${data.apartment ? data.apartment.identifier : 'Admin'}`,
      );
      doc.text(`Fecha de emisión: ${formatter.format(data.bill.createdAt)}`);

      const fixedExpenses = data.bill.expenses.filter(
        (expense) => expense.isFixed,
      );
      const variableExpenses = data.bill.expenses.filter(
        (expense) => !expense.isFixed,
      );
      const totalRecibo = data.bill.total;
      const totalCuota = individualBill?.Total || 0; // Manejar posible valor indefinido
      const totalDeuda = totalGeneral - totalCuota;

      let tableOptions = {
        width: doc.page.width, // Adjust table width
        layout: 'lightHorizontalLines', // Add thin horizontal lines
        cellPadding: 5, // Add some padding to cells
        headerRows: 1, // Only show header row as bold
        columnsSize: [260, 50, 100, 100],
      };

      // Crear la tabla con los totales
      const totalsTable = {
        headers: [
          'TOTAL RECIBO',
          'TOTAL CUOTA',
          'TOTAL DEUDA',
          'TOTAL POR PAGAR',
        ],
        rows: [
          [
            totalRecibo.toFixed(2).toString(),
            totalCuota.toString(),
            totalDeuda.toString(),
            totalGeneral.toString(),
          ],
        ],
      };

      doc.moveDown(2);
      const table = {
        title: data.bill.name,
        subtitle: data.bill.description,
        headers: [
          'DESCRIPCIÓN DE LA RELACIÓN DE GASTOS FIJOS',
          'AP',
          'MONTO',
          'MONTO CUOTA',
        ],
        rows: variableExpenses.map((expense) => {
          return [
            expense.name,
            expense.dependsOnShare ? 'A' : 'P',
            expense.total.toString(),
            expense.dependsOnShare
              ? (expense.total * data.apartment.share).toFixed(2).toString()
              : (expense.total / data.bill.buildingId.nApartments)
                  .toFixed(2)
                  .toString(),
          ];
        }),
      };

      doc.fillColor('black'); // Set default text color to black

      doc.table(table, tableOptions);

      doc.moveDown(2);
      const tableVariables = {
        headers: [
          'DESCRIPCIÓN DE LA RELACIÓN DE GASTOS VARIABLES',
          'AP',
          'MONTO',
          'MONTO CUOTA',
        ],
        rows: fixedExpenses.map((expense) => {
          return [
            expense.name,
            expense.dependsOnShare ? 'A' : 'P',
            expense.total.toString(),
            expense.dependsOnShare
              ? (expense.total * data.apartment.share).toFixed(2).toString()
              : (expense.total / data.bill.buildingId.nApartments)
                  .toFixed(2)
                  .toString(),
          ];
        }),
      };
      doc.table(tableVariables, tableOptions);
      doc.moveDown(2);
      tableOptions = {
        width: doc.page.width, // Adjust table width
        layout: 'lightHorizontalLines', // Add thin horizontal lines
        cellPadding: 5, // Add some padding to cells
        headerRows: 1, // Only show header row as bold
        columnsSize: [260, 125, 125],
      };
      const tableDebt = {
        headers: ['TITULO', 'FECHA DE EMISIÓN', 'MONTO'],
        rows: pastIndividualBills.map((bill) => {
          return [
            bill.Name,
            formatter.format(bill.createdAt),
            bill.Total.toString(),
          ];
        }),
      };
      doc.table(tableDebt, tableOptions);
      doc.moveDown(2);
      tableOptions = {
        width: doc.page.width, // Adjust table width
        layout: 'lightHorizontalLines', // Add thin horizontal lines
        cellPadding: 5, // Add some padding to cells
        headerRows: 1, // Only show header row as bold
        columnsSize: [125, 125, 130, 130],
      };
      doc.table(totalsTable, tableOptions);
      doc.text(`AP: A: Aplica por alícuota P: Aplica por propietario `);

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
