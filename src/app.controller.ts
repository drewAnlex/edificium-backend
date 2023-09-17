import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SetMetadata('isPublic', true)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aedificium')
  getAedificiumNumber() {
    return this.appService.getAedificiumNumber();
  }
}
