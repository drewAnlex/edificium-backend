import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';

@Injectable()
export class ApartmentsService {
  private apartments = [
    {
      id: 1,
      identifier: 'A-101',
      floor: 1,
      share: 0.1,
      balance: 0,
      status: 1,
    },
  ];

  findAll() {
    return this.apartments;
  }

  findOne(id: number) {
    return this.apartments.find((apartment) => apartment.id === id);
  }

  create(payload: CreateAparmentDTO) {
    const newApartment = {
      id: this.apartments.length + 1,
      ...payload,
    };
    this.apartments.push(newApartment);
    return newApartment;
  }

  update(id: number, payload: UpdateAparmentDTO) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    const index = this.apartments.findIndex((apartment) => apartment.id === id);
    this.apartments[index] = {
      ...this.apartments[index],
      ...payload,
    };
    return this.apartments[index];
  }

  remove(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    const apartmentIndex = this.apartments.findIndex(
      (apartment) => apartment.id === id,
    );
    this.apartments.splice(apartmentIndex, 1);
    return true;
  }
}
