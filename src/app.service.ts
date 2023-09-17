import { Injectable, Inject } from '@nestjs/common';
import config from './config';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('PG') private clientPg: Client,
  ) {}
  getHello(): string {
    return this.configService.misc.welcomeMessage;
  }

  getAedificiumNumber() {
    return { aedificium: '1' };
  }
}
