import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'User name',
      email: 'User email',
      password: 'User password',
      role: 'User role',
      status: 1,
    },
  ];

  findAll() {
    return this.users;
  }

  create(payload: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...payload,
    };
    this.users.push(newUser);
    return newUser;
  }
}
