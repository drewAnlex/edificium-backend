import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import PDFDocument from 'pdfkit-table';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';

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
    const totalGeneral = await this.ibService.adminIndividualDebt(
      apartmentId ? apartmentId : data.apartment.id,
    );
    let paymentMethodList = await this.paymnetMethodList.findByIndividualBill(
      individualBill.id,
    );

    paymentMethodList = paymentMethodList.filter(
      (paymentMethod) => paymentMethod.status === 1,
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
              label: `${data.bill.buildingId.name}, ${data.bill.buildingId.fiscalId}`,
              headerColor: 'white',
            },
          ],
          rows: [[data.bill.buildingId.zone]],
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
      doc.text(`Relación de gastos N°: ${data.bill.id}`);
      doc.text(`Propietario: ${data.owner.name}`);
      doc.text(
        `Inmueble: ${data.apartment ? data.apartment.identifier : 'Admin'}`,
      );
      doc.text(`Fecha de emisión: ${formatter.format(data.bill.createdAt)}`);

      const fixedExpenses = data.bill.expenses.filter(
        (expense) => expense.isFixed && expense.isRemoved === false,
      );
      const variableExpenses = data.bill.expenses.filter(
        (expense) => !expense.isFixed && expense.isRemoved === false,
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
            totalRecibo?.toFixed(2),
            totalCuota.toString(),
            totalDeuda?.toFixed(2),
            totalGeneral?.toFixed(2),
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
    const pdfBuffer: Buffer = await new Promise((resolve) => {
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

      const totalDebt = apartments.reduce(
        (sum, apartment) => sum + apartment.balance,
        0,
      );

      const totalBills = apartments.reduce(
        (sum, apartment) => sum + apartment.individualBills.length,
        0,
      );
      const baseYPosition = 127.5; // Punto de inicio en el eje Y (ajusta según sea necesario)
      const rowHeight = 16; // Altura de cada fila (ajusta según el diseño)

      const table = {
        title: 'Estado de cuenta',
        subtitle: `Deuda actualizada al: ${formatter.format(new Date())}`,
        headers: [
          '',
          'Identificador',
          'Propietario',
          'Facturas pendientes',
          'Deuda',
        ],
        rows: [
          ...apartments.map((apartment, index) => {
            const rowPosition = baseYPosition + index * rowHeight;
            if (apartment.individualBills.length > 0) {
              doc
                .circle(55, rowPosition, 5) // Ajustar la posición X e Y según sea necesario
                .fillColor('red')
                .fill();
            } else {
              doc
                .circle(55, rowPosition, 5) // Ajustar la posición X e Y según sea necesario
                .fillColor('green')
                .fill();
            }
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
      const lastRowYPosition =
        baseYPosition + apartments.length * rowHeight + 20; // Ajustar según sea necesario
      doc.text(`Pendientes: ${totalBills.toString()}`, 360, lastRowYPosition, {
        align: 'left',
      });
      doc.text(`Deuda: ${totalDebt.toString()}`, 460, lastRowYPosition, {
        align: 'left',
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
}
