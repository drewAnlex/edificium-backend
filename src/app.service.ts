import { Injectable, Inject } from '@nestjs/common';
import config from './config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}
  getHello(): string {
    return this.configService.misc.welcomeMessage;
  }

  getAedificiumNumber(): number {
    return 1;
  }
}
