import { Injectable } from '@nestjs/common';
import { SendToWhatsappService } from './http-service/send-to-whatsapp.service';

@Injectable()
export class WhatsappService {
  constructor(private sendToWs: SendToWhatsappService) {}
  async sendMessage(to: string, body: string, messageId: number) {
    const data = {
      messaging_product: 'whatsapp',
      context: {
        message_id: messageId,
      },
      to,
      text: { body },
    };
    return await this.sendToWs.sendToWhatsApp(data);
  }

  async markAsRead(messageId: string) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };
    return await this.sendToWs.sendToWhatsApp(data);
  }

  async sendListMessage(
    to: string,
    header: string,
    body: string,
    footer: string,
    buttonText: string,
    list: any,
  ) {
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: header,
        },
        body: {
          text: body,
        },
        footer: {
          text: footer,
        },
        action: {
          button: buttonText,
          sections: list,
        },
      },
    };
    return await this.sendToWs.sendToWhatsApp(data);
  }

  async sendInteractiveButtons(to: string, body: string, buttons: any) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: {
          buttons: buttons,
        },
      },
    };
    return await this.sendToWs.sendToWhatsApp(data);
  }

  async sendMediaMessageByUrl(
    to: string,
    type: string,
    mediaUrl: string,
    caption: string,
    filename?: string,
  ) {
    try {
      const mediaObject = {
        image: {},
        audio: {},
        video: {},
        document: {},
      };

      switch (type) {
        case 'image':
          mediaObject.image = { link: mediaUrl, caption: caption };
          break;
        case 'audio':
          mediaObject.audio = { link: mediaUrl };
          break;
        case 'video':
          mediaObject.video = { link: mediaUrl, caption: caption };
          break;
        case 'document':
          mediaObject.document = {
            link: mediaUrl,
            caption: caption,
            filename: filename,
          };
          break;
        default:
          throw new Error('Not Supported Media Type');
      }

      const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: type,
        ...mediaObject,
      };

      return await this.sendToWs.sendToWhatsApp(data);
    } catch (error) {
      console.error('Error sending Media', error);
    }
  }

  async sendMediaMessageById(
    to: string,
    type: string,
    mediaId: string,
    caption: string,
    filename?: string,
  ) {
    try {
      const mediaObject = {
        image: {},
        audio: {},
        video: {},
        document: {},
      };

      switch (type) {
        case 'image':
          mediaObject.image = { link: mediaId, caption: caption };
          break;
        case 'audio':
          mediaObject.audio = { link: mediaId };
          break;
        case 'video':
          mediaObject.video = { link: mediaId, caption: caption };
          break;
        case 'document':
          mediaObject.document = {
            link: mediaId,
            caption: caption,
            filename: filename,
          };
          break;
        default:
          throw new Error('Not Soported Media Type');
      }
      const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: type,
        ...mediaObject,
      };

      return await this.sendToWs.sendToWhatsApp(data);
    } catch (error) {
      console.error('Error sending Media', error);
    }
  }

  async sendContactMessage(to: string, contact) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'contacts',
      contacts: [contact],
    };
    return await this.sendToWs.sendToWhatsApp(data);
  }
}
