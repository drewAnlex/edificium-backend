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
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  //Implementar los metodos del CRUD de usuarios (GET, POST, PUT, DELETE)
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

  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId);
  }

  @Post()
  createUser(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Put(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(userId, payload);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.remove(userId);
  }
}
