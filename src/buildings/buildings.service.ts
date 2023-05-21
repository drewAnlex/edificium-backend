import { Injectable, NotFoundException } from '@nestjs/common';

import { Building } from '../entities/building';

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

  create(payload: any) {
    const newBuilding = {
      id: this.buildings.length + 1,
      ...payload,
    };
    this.buildings.push(newBuilding);
    return newBuilding;
  }

  update(id: number, payload: any) {
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
