import { Injectable, NotFoundException } from '@nestjs/common';
import { IndividualBill } from '../entities/IndividualBill';
import {
  IndividualBillDto,
  UpdateIndividualBillDto,
} from '../dtos/IndividualBill.dto';

@Injectable()
export class IndividualBillsService {
  private IndividualBill: IndividualBill[] = [
    {
      id: 1,
      BuildingBillId: 1,
      ApartmentId: 1,
      Name: 'IndividualBill 1',
      Description: 'Description 1',
      Total: 100,
      Balance: 100,
      IsPaid: false,
    },
  ];

  findAll() {
    return this.IndividualBill;
  }

  findOne(id: number) {
    const IndividualBill = this.IndividualBill.find((item) => item.id === id);
    if (!IndividualBill) {
      throw new NotFoundException(`IndividualBill #${id} not found`);
    }
    return IndividualBill;
  }

  create(data: IndividualBillDto) {
    const newIndividualBill = { id: this.IndividualBill.length + 1, ...data };
    this.IndividualBill.push(newIndividualBill);
    return newIndividualBill;
  }

  update(id: number, changes: UpdateIndividualBillDto) {
    const IndividualBill = this.findOne(id);
    const index = this.IndividualBill.findIndex((item) => item.id === id);
    this.IndividualBill[index] = { ...IndividualBill, ...changes };
    return this.IndividualBill[index];
  }

  remove(id: number) {
    const index = this.IndividualBill.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`IndividualBill #${id} not found`);
    }
    this.IndividualBill.splice(index, 1);
    return true;
  }
}
