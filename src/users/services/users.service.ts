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
import * as bcrypt from 'bcrypt';
import { OutboundService } from '../../mailing/services/outbound.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailingService: OutboundService,
  ) {}

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

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email: email },
      relations: ['role', 'building', 'apartments'],
    });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userRepo.create({
      ...payload,
      role: { id: 1 },
    });
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    try {
      await this.userRepo.save(newUser);
      this.mailingService.userRegistrationEmail(newUser.email);
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
