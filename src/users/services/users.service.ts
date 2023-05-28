import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'User name',
      email: 'User email',
      phone: 'User phone',
      password: 'User password',
      role: 'User role',
      status: 1,
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  create(payload: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...payload,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, payload: UpdateUserDto) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...payload,
    };
    return this.users[userIndex];
  }

  remove(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const index = this.users.findIndex((user) => user.id === id);
    this.users.splice(index, 1);
    return true;
  }
}
