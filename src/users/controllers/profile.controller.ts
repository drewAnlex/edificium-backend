import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Query,
  ParseIntPipe,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PayloadToken } from 'src/auth/models/token.model';

@ApiTags('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-profile')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getUser(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.usersService.findOne(user.sub);
  }

  @Roles('Staff', 'Admin', 'User')
  @Put()
  updateUser(@Req() req: Request, @Body() payload: UpdateUserDto) {
    const user = req.user as PayloadToken;
    return this.usersService.update(user.sub, payload);
  }

  @Roles('Staff', 'Admin', 'User')
  @Delete()
  deleteUser(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.usersService.remove(user.sub);
  }
}
