import { Injectable, NotFoundException } from '@nestjs/common';
import { BuildingAdmins } from '../entities/Admins';
import { CreateAdminDTO, UpdateAdminDTO } from '../dtos/admins.dto';
import { UsersService } from 'src/users/services/users.service';
import { BuildingsService } from './buildings.service';

@Injectable()
export class AdminsService {
  constructor(
    private usersService: UsersService,
    private buildingsService: BuildingsService,
  ) {}

  private admins: BuildingAdmins[] = [
    {
      id: 1,
      buildingId: 1,
      userId: 1,
    },
  ];

  findAll() {
    return this.admins;
  }

  findOne(id: number) {
    const admin = this.admins.find((admin) => admin.id === id);
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  findByBuilding(id: number) {
    const admin = this.admins.find((admin) => admin.buildingId === id);
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  findByUser(id: number) {
    const admin = this.admins.find((admin) => admin.userId === id);
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  setAdmin(admin: CreateAdminDTO) {
    const building = this.buildingsService.findOne(admin.buildingId);
    if (!building) {
      throw new NotFoundException(`Building #${admin.buildingId} not found`);
    }
    const user = this.usersService.findOne(admin.userId);
    if (!user) {
      throw new NotFoundException(`User #${admin.userId} not found`);
    }
    const newAdmin = {
      id: this.admins.length + 1,
      ...admin,
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  update(id: number, payload: UpdateAdminDTO) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    if (
      payload.buildingId &&
      !this.buildingsService.findOne(payload.buildingId)
    ) {
      throw new NotFoundException(`Building #${payload.buildingId} not found`);
    }
    if (payload.userId && !this.usersService.findOne(payload.userId)) {
      throw new NotFoundException(`User #${payload.userId} not found`);
    }
    const index = this.admins.findIndex((admin) => admin.id === id);
    this.admins[index] = {
      ...this.admins[index],
      ...payload,
    };
    return this.admins[index];
  }

  remove(id: number) {
    const index = this.admins.findIndex((admin) => admin.id === id);
    if (index === -1) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    this.admins.splice(index, 1);
    return true;
  }
}
