import { Injectable, NotFoundException } from '@nestjs/common';

import { Building } from '../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from '../dtos/building.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building) private buildingRepo: Repository<Building>,
  ) {}

  async findAll() {
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

  async findOne(id: number) {
    const building = await this.buildingRepo.findOne({
      where: { id: id },
      relations: [
        'suppliers',
        'contractors',
        'buildingBills',
        'admins',
        'apartments',
      ],
    });
    if (!building) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    return building;
  }

  create(payload: CreateBuildingDto) {
    const newBuilding = this.buildingRepo.create(payload);
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
}
