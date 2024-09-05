import * as fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import * as path from 'path';

@Injectable()
export class OutboundService {
  private readonly mg: any;

  constructor() {
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
}
