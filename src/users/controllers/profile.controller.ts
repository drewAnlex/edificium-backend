import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/users.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-profile')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Roles('Staff', 'Admin', 'User')
  @Get()
  getUser(@Req() req: Request) {
    const user = req.user as any;
    console.log(user);
    return this.usersService.findOne(user.userId);
  }

  @Roles('Staff', 'Admin', 'User')
  @Put()
  updateUser(@Req() req: Request, @Body() payload: UpdateUserDto) {
    const user = req.user as any;
    return this.usersService.update(user.userId, payload);
  }

  @Roles('Staff', 'Admin', 'User')
  @Delete()
  deleteUser(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.remove(user.userId);
  }
}
