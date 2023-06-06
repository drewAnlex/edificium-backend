import { Injectable, NotFoundException } from '@nestjs/common';
import { BuildingBill } from '../entities/BuildingBill.entity';
import {
  CreateBuildingBillDTO,
  UpdateBuildingBillDTO,
} from '../dtos/BuildingBill.dto';

@Injectable()
export class BuildingBillsService {
  private buildingBills: BuildingBill[] = [
    {
      Id: 1,
      buildingId: 1,
      userId: 1,
      name: 'Bill 1',
      description: 'Bill 1 description',
      balance: -100,
      total: 100,
    },
  ];

  findAll() {
    return this.buildingBills;
  }

  findOne(id: number) {
    return this.buildingBills.find((buildingBill) => buildingBill.Id === id);
  }

  create(payload: CreateBuildingBillDTO) {
    const newBuildingBill = {
      Id: this.buildingBills.length + 1,
      ...payload,
    };

    this.buildingBills.push(newBuildingBill);

    return newBuildingBill;
  }

  update(id: number, payload: UpdateBuildingBillDTO) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }

    const index = this.buildingBills.findIndex(
      (buildingBill) => buildingBill.Id === id,
    );
    this.buildingBills[index] = {
      ...this.buildingBills[index],
      ...payload,
    };

    return this.buildingBills[index];
  }

  delete(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Building Bill #${id} not found`);
    }

    // use splice to remove the buildingBill from the array
    const index = this.buildingBills.findIndex(
      (buildingBill) => buildingBill.Id === id,
    );
    this.buildingBills.splice(index, 1);
    return true;
  }
}
