import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IndividualBillsService } from '../services/individual-bills.service';
import {
  IndividualBillDto,
  UpdateIndividualBillDto,
} from '../dtos/IndividualBill.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('individual-bills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('individual-bills')
export class IndividualBillsController {
  constructor(
    private readonly individualBillsService: IndividualBillsService,
  ) {}

  @Roles('Staff', 'Admin', 'User')
  @Get('apartments-with-debt/:id')
  getApartmentsWithDebt(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.apartmentsWithDebt(id);
  }

  @Roles('Staff', 'Admin', 'User')
  @Get('debt')
  getDebt(@Req() req: Request) {
    const user = req.user as any;
    return this.individualBillsService.individualDebt(user.userId);
  }

  @Roles('Staff', 'Admin')
  @Get('admindebt/:id')
  getAdminDebt(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.adminIndividualDebt(id);
  }

  @Roles('Staff')
  @Get()
  findAll() {
    return this.individualBillsService.findAll();
  }

  @Roles('Admin', 'User')
  @Get('apartment/:apartmentId')
  findByApartment(
    @Param('apartmentId', ParseIntPipe) apartmentId: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.individualBillsService.findByApartment(
      apartmentId,
      user.userId,
    );
  }

  @Roles('Admin', 'User')
  @Get('apartment/:apartmentId/:id')
  findOneByIdAndApartment(
    @Param('id', ParseIntPipe) id: number,
    @Param('apartmentId', ParseIntPipe) apartmentId: number,
  ) {
    return this.individualBillsService.findOneByIdAndApartment(id, apartmentId);
  }

  @Roles('Staff')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.findOne(id);
  }

  @Roles('Staff', 'Admin')
  @Post()
  create(@Body() data: IndividualBillDto) {
    return this.individualBillsService.create(
      data,
      parseInt(data.apartmentId.toString()),
    );
  }

  @Roles('Staff')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateIndividualBillDto,
  ) {
    return this.individualBillsService.update(id, changes);
  }

  @Roles('Staff', 'Admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.individualBillsService.remove(id);
  }
}
