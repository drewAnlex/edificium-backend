import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FundService } from '../services/fund.service';
import { FundDTO, UpdateFundDTO } from '../dtos/fund.dto';

@ApiTags('Funds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fund')
export class FundController {
  constructor(private fundService: FundService) {}

  @Roles('Staff')
  @Get()
  getFunds() {
    return this.fundService.findAll();
  }

  @Roles('Staff', 'Admin')
  @Get(':id')
  getFund(@Param('id', ParseIntPipe) id: number) {
    return this.fundService.findOne(id);
  }

  @Roles('Staff', 'Admin')
  @Get('building/:id')
  getFundsByBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.fundService.findByBuilding(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  createFund(@Body() payload: FundDTO) {
    return this.fundService.create(payload);
  }

  @Roles('Staff', 'Admin')
  @Put(':id')
  updateFund(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateFundDTO,
  ) {
    return this.fundService.update(id, payload);
  }

  @Roles('Staff')
  @Delete(':id')
  deleteFund(@Param('id', ParseIntPipe) id: number) {
    return this.fundService.remove(id);
  }
}
