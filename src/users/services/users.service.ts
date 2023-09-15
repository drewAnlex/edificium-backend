import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/User.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll() {
    return this.userRepo.find({
      relations: ['role', 'building', 'apartments', 'payments'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id: id },
      relations: ['role', 'building', 'apartments', 'payments'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userRepo.create(payload);
    try {
      await this.userRepo.save(newUser);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the User: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newUser;
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.findOne(id);
    try {
      await this.userRepo.merge(user, payload);
      await this.userRepo.save(user);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the User: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
