import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import PDFDocument from 'pdfkit-table';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import * as ExcelJS from 'exceljs';

const formatter = new Intl.DateTimeFormat('es-ES'); // 'es-ES' para español de España

@Injectable()
export class BillingService {
  constructor(
    private bbService: BuildingBillsService,
    private ibService: IndividualBillsService,
    private paymnetMethodList: PaymentMethodListService,
    private apartmentService: ApartmentsService,
    @Inject(forwardRef(() => BuildingsService))
    private buildingService: BuildingsService,
  ) {}
  async generateBillPDF(
    bill: number,
    user: number,
    apartmentId?: number,
  ): Promise<Buffer> {
    const data = await this.bbService.findOneByOwner(bill, user);
    apartmentId
      ? (data.apartment = await this.apartmentService.findOne(apartmentId))
      : (data.apartment = data.apartment);
    const individualBills = await this.ibService.findAllByApartment(
      apartmentId ? apartmentId : data.apartment.id,
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
    let paymentMethodList = await this.paymnetMethodList.findByIndividualBill(
      individualBill.id,
    );

    paymentMethodList = paymentMethodList.filter(
      (paymentMethod) => paymentMethod.status === 1,
    );

    const billTitle = data.bill.buildingId.billTitle
      ? data.bill.buildingId.billTitle
      : 'NEXIADMIN';
    const logoUrl = data.bill.buildingId.logoImg
      ? data.bill.buildingId.logoImg
      : 'http://67.205.149.177/images/icon.jpeg';

    const nexiLogo = 'http://67.205.149.177/images/icon.jpeg';
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
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
              label: `${data.bill.buildingId.name}, ${data.bill.buildingId.fiscalId}`,
              headerColor: 'white',
            },
          ],
          rows: [[data.bill.buildingId.zone]],
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
      doc.text(`Relación de gastos N°: ${data.bill.id}`);
      doc.text(`Propietario: ${data.owner.name}`);
      doc.text(
        `Inmueble: ${data.apartment ? data.apartment.identifier : 'Admin'}`,
      );
      doc.text(`Alicuota: ${data.apartment.share}`);
      doc.text(`Fecha de emisión: ${formatter.format(data.bill.createdAt)}`);

      const fixedExpenses = data.bill.expenses.filter(
        (expense) => expense.isFixed && expense.isRemoved === false,
      );
      const variableExpenses = data.bill.expenses.filter(
        (expense) => !expense.isFixed && expense.isRemoved === false,
      );
      const totalRecibo = data.bill.total;
      const totalCuota = individualBill?.Total || 0; // Manejar posible valor indefinido
      const totalDeuda = await this.ibService.adminIndividualDebt(
        data.apartment.id,
      );
      const facturasPendientes =
        await this.ibService.findUnpaidBillsByApartment(data.apartment.id);

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
          'FACTURAS PENDIENTES',
          'BALANCE',
        ],
        rows: [
          [
            totalRecibo?.toFixed(2),
            totalCuota.toString(),
            totalDeuda.toString(),
            facturasPendientes.length.toString(),
            data.apartment.balance.toString(),
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
        columnsSize: [125, 125, 100, 60, 100],
      };
      doc.table(totalsTable, tableOptions);
      doc.text(`AP: A: Aplica por alícuota P: Aplica por propietario `);

      doc.moveDown(2);
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(`Metodos de pago:`);
      doc.font('Helvetica').fontSize(10);
      paymentMethodList.map((method) => {
        if (
          doc.y + doc.currentLineHeight(true) >
          doc.page.height - doc.page.margins.bottom
        ) {
          doc.addPage();
        }
        doc.text(`${method.name}`);
        method.paymentDetails.map((detail) => {
          if (
            doc.y + doc.currentLineHeight(true) >
            doc.page.height - doc.page.margins.bottom
          ) {
            doc.addPage();
          }
          doc.text(`${detail.Name}: ${detail.description}`);
        });
        doc.moveDown(1);
      });

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

  async accountStatement(buildingId: number) {
    const building = await this.buildingService.findOne(buildingId);
    const apartments = await this.apartmentService.getApartmentsByBuilding(
      buildingId,
    );
    const logoUrl = 'http://67.205.149.177/images/icon.jpeg';
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: false,
      });
      doc.on('pageAdded', () => {
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

        doc.text('NEXIADMIN', doc.page.width - 220, 25, { align: 'left' });

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
        cellPadding: 5,
        headerRows: 1,
        columnsSize: [10, 70, 230, 100, 100],
      };

      const totalDebt = await this.bbService.buildingDebt(building.id);

      const totalBills = apartments.reduce(
        (sum, apartment) => sum + apartment.individualBills.length,
        0,
      );

      const table = {
        title: 'Estado de cuenta',
        subtitle: `Deuda actualizada al: ${formatter.format(new Date())}`,
        headers: [
          '',
          'Identificador',
          'Propietario',
          'Facturas pendientes',
          'Balance',
        ],
        rows: [
          ...apartments.map((apartment) => {
            return [
              '', // Dejar vacío ya que el círculo se dibuja manualmente
              apartment.identifier,
              apartment.userId?.name ? apartment.userId.name : '',
              apartment.individualBills.length.toString(),
              apartment.balance.toString(),
            ];
          }),
        ],
      };

      doc.table(table, tableOptions);
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text(
        `Pendientes: ${totalBills.toString()}    Deuda: ${(
          totalDebt * -1
        ).toFixed(2)}`,
        360,
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

  async simpleAccountStatementExcel(buildingId: number): Promise<Buffer> {
    const building = await this.buildingService.findOne(buildingId);
    const apartments = await this.apartmentService.getApartmentsByBuilding(
      buildingId,
    );
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(building.name);

    worksheet.columns = [
      { header: 'Identificador', key: 'identifier', width: 20 },
      { header: 'Propietario', key: 'name', width: 20 },
      { header: 'Facturas pendientes', key: 'bills', width: 20 },
      { header: 'Balance', key: 'debt', width: 20 },
    ];
    apartments.forEach((apartment) => {
      worksheet.addRow({
        identifier: apartment.identifier,
        name: apartment.userId?.name ? apartment.userId.name : '',
        bills: apartment.individualBills.length,
        debt: apartment.balance,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
