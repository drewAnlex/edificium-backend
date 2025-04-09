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
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}
  //Implementar los metodos del CRUD de usuarios (GET, POST, PUT, DELETE)
  @Roles('Staff')
  @Get()
  getUsers(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('role') role: string,
  ) {
    return this.usersService.findAll();
  }

  @Roles('Staff')
  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId);
  }

  @SetMetadata('isPublic', true)
  @Post()
  createUser(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Roles('Staff')
  @Put(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(userId, payload);
  }

  @Roles('Staff')
  @Put('change-password/:userId')
  changePassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: { newPassword: string },
  ) {
    return this.usersService.changePasswordByStaff(userId, payload.newPassword);
  }

  @Roles('Staff')
  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.remove(userId);
  }
}
