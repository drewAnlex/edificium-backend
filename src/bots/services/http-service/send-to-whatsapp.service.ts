import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { HttpStatusCode } from 'axios';

@Injectable()
export class SendToWhatsappService {
  private readonly whatsappApiUrl: string;
  private readonly token: string;
  constructor(private configService: ConfigService) {
    this.whatsappApiUrl = this.configService.get<string>('BASE_URL');
    this.token = this.configService.get<string>('API_TOKEN');
  }

  async sendToWhatsApp(data) {
    const url = `${this.whatsappApiUrl}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al enviar el mensaje',
        HttpStatusCode.BadRequest,
      );
    }
  }
}
