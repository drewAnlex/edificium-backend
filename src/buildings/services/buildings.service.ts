import { Injectable, NotFoundException } from '@nestjs/common';

import { Building } from '../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from '../dtos/building.dto';

@Injectable()
export class BuildingsService {
  private buildings: Building[] = [
    {
      id: 1,
      name: 'Building name',
      country: 'Country',
      state: 'State',
      city: 'City',
      zone: 'Zone',
      nApartments: 10,
      apartments: [],
      administrators: [{ id: 1, name: 'Administrator name' }],
      coOwners: [],
      bills: [],
      news: [],
      status: 3,
    },
  ];

  findAll() {
    return this.buildings;
  }

  findOne(id: number) {
    const building = this.buildings.find((building) => building.id === id);
    if (!building) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    return building;
  }

  create(payload: CreateBuildingDto) {
    const newBuilding = {
      id: this.buildings.length + 1,
      ...payload,
      apartments: [],
      administrators: [],
      coOwners: [],
      bills: [],
      news: [],
    };
    this.buildings.push(newBuilding);
    return newBuilding;
  }

  update(id: number, payload: UpdateBuildingDto) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    const index = this.buildings.findIndex((building) => building.id === id);
    this.buildings[index] = {
      ...this.buildings[index],
      ...payload,
    };
    return this.buildings[index];
  }

  remove(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Building #${id} not found`);
    }
    const index = this.buildings.findIndex((building) => building.id === id);
    this.buildings.splice(index, 1);
    return true;
  }
}
