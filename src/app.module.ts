import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingsModule } from './buildings/buildings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BuildingsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
