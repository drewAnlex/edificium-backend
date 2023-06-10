import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/Role.entity';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/roles.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOneBy({ id: id });
    if (role === null) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }

  create(payload: CreateRoleDTO) {
    const newRole = this.roleRepo.create(payload);
    return this.roleRepo.save(newRole);
  }

  async update(id: number, payload: UpdateRoleDTO) {
    const role = await this.findOne(id);
    if (role === null) {
      throw new NotFoundException(`Role #${id} not found`);
    }

    this.roleRepo.merge(role, payload);
    return this.roleRepo.save(role);
  }

  remove(id: number) {
    return this.roleRepo.delete(id);
  }
}
