import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/Role';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/roles.dto';

@Injectable()
export class RolesService {
  private roles: Role[] = [
    { Id: 1, Name: 'Admin' },
    { Id: 2, Name: 'User' },
  ];

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: number): Role {
    return this.roles.find((role) => role.Id === id);
  }

  create(payload: CreateRoleDTO): Role {
    const newRole = { Id: this.roles.length + 1, ...payload };
    this.roles.push(newRole);
    return newRole;
  }

  update(id: number, payload: UpdateRoleDTO): Role {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    const roleIndex = this.roles.findIndex((role) => role.Id === id);
    this.roles[roleIndex] = {
      ...this.roles[roleIndex],
      ...payload,
    };
    return this.roles[roleIndex];
  }

  remove(id: number): boolean {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    this.roles = this.roles.filter((role) => role.Id !== id);
    return true;
  }
}
