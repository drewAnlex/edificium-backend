import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Building } from '../entities/building.entity';
import {
  CreateBuildingDto,
  FilterBuildingsDto,
  UpdateBuildingDto,
} from '../dtos/building.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building) private buildingRepo: Repository<Building>,
    private userService: UsersService,
  ) {}

  async findAll(params?: FilterBuildingsDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.buildingRepo.find({
        relations: [
          'suppliers',
          'contractors',
          'buildingBills',
          'admins',
          'apartments',
        ],
        skip: offset,
        take: limit,
      });
    }
    return await this.buildingRepo.find({
      relations: [
        'suppliers',
        'contractors',
        'buildingBills',
        'admins',
        'apartments',
      ],
    });
  }

  async findMyBuildings(userId: number) {
    const buildings = await this.buildingRepo.find({
      where: [
        { apartments: { userId: { id: userId } } },
        { admins: { id: userId } },
      ],
    });
    if (!buildings) {
      throw new NotFoundException(`Buildings not found`);
    }
    return buildings;
  }

  async findOneByOwner(id: number, userId: number) {
    const building = await this.buildingRepo.findOne({
      where: { id: id, apartments: { userId: { id: userId } } },
      relations: ['baseCurrency', 'auxiliaryCurrency'],
    });
    if (!building) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    return building;
  }

  async findOne(id: number) {
    const building = await this.buildingRepo.findOne({
      where: { id: id },
      relations: ['buildingBills', 'admins', 'apartments'],
    });
    if (!building) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    return building;
  }

  create(payload: CreateBuildingDto) {
    const newBuilding = this.buildingRepo.create(payload);
    newBuilding.uuid = uuidv4();
    return this.buildingRepo.save(newBuilding);
  }

  async update(id: number, payload: UpdateBuildingDto) {
    const building = await this.findOne(id);
    await this.buildingRepo.merge(building, payload);
    return this.buildingRepo.save(building);
  }

  remove(id: number) {
    return this.buildingRepo.delete(id);
  }

  async setBuildingAdmin(uuid: string, adminId: number) {
    const building = await this.buildingRepo.findOne({ where: { uuid } });
    if (!building) throw new NotFoundException(`Building #${uuid} not found`);
    const admin = await this.userService.findOne(adminId);
    admin.building.push(building);
    await this.userService.update(adminId, admin);
    return { message: 'Building admin assigned' };
  }

  async getBuildingExpenses(buildingId: number) {
    const building = await this.buildingRepo.find({
      where: { id: buildingId },
      relations: [
        'products',
        'products.BuildingBillsID',
        'services',
        'services.buildingBillId',
      ],
    });
    if (!building) {
      throw new NotFoundException(`Building #${buildingId} not found`);
    }
    return building;
  }

  async getBuildingsByAdmin(id: number) {
    const buildings = await this.buildingRepo.find({
      where: { admins: { id: id } },
    });
    if (!buildings) {
      throw new NotFoundException(`Building not found`);
    }
    return buildings;
  }
}
