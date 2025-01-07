import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import { MessageHandlerService } from '../services/message-handler.service';

@ApiTags('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('whatsapp')
export class WhatsappController {
  webHookToken: string;
  constructor(
    private readonly messageHandler: MessageHandlerService,
    private configService: ConfigService,
  ) {
    this.webHookToken = this.configService.get<string>('WEBHOOK_VERIFY_TOKEN');
  }

  @Public()
  @Post('webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const senderInfo = body.entry?.[0]?.changes[0]?.value?.contacts?.[0];
    if (message) {
      await this.messageHandler.handleIncomingMessage(message, senderInfo);
    }
    res.sendStatus(200);
    return { status: 'success' };
  }

  @Public()
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    if (mode === 'subscribe' && token === this.webHookToken) {
      res.status(200).send(challenge);
      console.log('Webhook verified successfully!');
    } else {
      res.sendStatus(403);
    }
  }
}
