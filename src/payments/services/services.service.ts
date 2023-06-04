import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../entities/Service';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/Service.dto';

@Injectable()
export class ServicesService {
  private services: Service[] = [
    {
      id: 1,
      buildingBillId: 1,
      name: 'Electricity',
      description: 'Electricity bill',
      contractorId: 1,
      price: 100,
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-01-31'),
      isPaid: false,
    },
  ];

  findAll() {
    return this.services;
  }

  findOne(id: number) {
    return this.services.find((service) => service.id === id);
  }

  create(payload: CreateServiceDTO) {
    const newService = {
      id: this.services.length + 1,
      ...payload,
    };
    this.services.push(newService);
    return newService;
  }

  update(id: number, payload: UpdateServiceDTO) {
    if (!this.findOne(id)) {
      throw new NotFoundException('Service not found');
    }
    const index = this.services.findIndex((service) => service.id === id);
    this.services[index] = {
      ...this.services[index],
      ...payload,
    };
    return this.services[index];
  }

  remove(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException('Service not found');
    }
    this.services = this.services.filter((service) => service.id !== id);
    return true;
  }
}
