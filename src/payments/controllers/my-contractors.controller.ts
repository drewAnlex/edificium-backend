import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContractorService } from '../services/contractor.service';
import {
  CreateContractorDTO,
  UpdateContractorDTO,
} from '../dtos/contractor.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('contractor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-contractors')
export class MyContractorsController {
  constructor(private contractorService: ContractorService) {}

  @Roles('Admin', 'User')
  @Get()
  getAll(@Req() req: Request) {
    const user = req.user as any;
    return this.contractorService.findAllByBuilding(user.building);
  }

  @Roles('Admin', 'User')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.contractorService.findOneByBuilding(id, user.building);
  }

  @Roles('Admin')
  @Post()
  create(@Body() payload: CreateContractorDTO, @Req() req: Request) {
    const user = req.user as any;
    return this.contractorService.create(payload, user.building);
  }

  @Roles('Admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateContractorDTO,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.contractorService.update(id, payload, user.building);
  }

  @Roles('Admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.contractorService.delete(id, user.building);
  }
}
