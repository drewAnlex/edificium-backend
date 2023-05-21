import { Injectable } from '@nestjs/common';

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
      administrator: 'Administrator',
      coOwners: [],
      bills: [],
      news: [],
    },
  ];

  findAll() {
    return this.buildings;
  }

  findOne(id: number) {
    return this.buildings.find((building) => building.id === id);
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
    const index = this.buildings.findIndex((building) => building.id === id);
    this.buildings[index] = {
      ...this.buildings[index],
      ...payload,
    };
    return this.buildings[index];
  }

  remove(id: number) {
    const index = this.buildings.findIndex((building) => building.id === id);
    this.buildings.splice(index, 1);
    return true;
  }
}
