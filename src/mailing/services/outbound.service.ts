import * as fs from 'fs/promises';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
// import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import * as path from 'path';
import { BuildingBillsService } from 'src/payments/services/building-bills.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { BillingService } from 'src/reports/services/billing.service';

@Injectable()
export class OutboundService {
  private readonly mg: any;

  constructor(
    @Inject(forwardRef(() => BuildingBillsService))
    private buildingBill: BuildingBillsService,
    private individualBill: IndividualBillsService,
    private billing: BillingService,
  ) {
    const mailgun = new Mailgun(FormData);
    this.mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
    });
  }

  async testService(email: string): Promise<void> {
    try {
      const messageData = {
        from: 'Excited User <mailgun@sandbox0918d61f84384276b051e69e193a6178.mailgun.org>',
        to: [email],
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!',
        html: '<h1>Testing some Mailgun awesomeness!</h1>',
      };

      const response = await this.mg.messages.create(
        'sandbox0918d61f84384276b051e69e193a6178.mailgun.org',
        messageData,
      );
      console.log(response); // logs response data
    } catch (error) {
      console.error(error); // logs any error
      throw new Error(error);
    }
  }

  async userRegistrationEmail(email: string): Promise<void> {
    const relativePath = '../../templates/welcome.html';
    const absolutePath = path.resolve(__dirname, relativePath);
    try {
      const welcome = await fs.readFile(absolutePath, 'utf8');
      const messageData = {
        from: process.env.EMAIL_SYSTEM_ADDR,
        to: [email],
        subject: 'Bienvenido a Nexi Admin!',
        text: 'Bienvenido a Nexi Admin!',
        html: welcome,
      };

      const response = await this.mg.messages.create(
        process.env.MAILING_DOMAIN,
        messageData,
      );
      console.log(response); // logs response data
    } catch (error) {
      console.error(error); // logs any error
      throw new Error(error);
    }
  }
  async buildingBillEmail(building: number): Promise<void> {
    const relativePath = '../../templates/receipt.html';
    const absolutePath = path.resolve(__dirname, relativePath);
    const bill = await this.buildingBill.getLatestForEmail(building);
    const apartments = bill.buildingId.apartments;
    apartments.forEach(async (apartment) => {
      const debt = await this.individualBill.adminIndividualDebt(apartment.id);
      if (debt != 0 && apartment?.userId?.email) {
        const user = apartment.userId;
        const buffer = await this.billing.generateBillPDF(
          bill.id,
          user.id,
          apartment.id,
        );
        try {
          const receipt = await fs.readFile(absolutePath, 'utf8');
          const messageData = {
            from: process.env.EMAIL_SYSTEM_ADDR,
            to: [user.email],
            subject: bill.name,
            text: 'Avsio de cobro',
            html: receipt,
            attachment: buffer,
          };

          const response = await this.mg.messages.create(
            process.env.MAILING_DOMAIN,
            messageData,
          );
          console.log(response); // logs response data
        } catch (error) {
          console.error(error); // logs any error
          throw new Error(error);
        }
      }
    });
  }
}
