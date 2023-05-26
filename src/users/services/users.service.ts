import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';

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
}
