import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Service } from '../entities/Service.entity';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/Service.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  findAll() {
    return this.serviceRepo.find({
      relations: ['contractorId', 'buildingBillId'],
    });
  }

  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id: id },
      relations: ['contractorId', 'buildingBillId'],
    });
    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return service;
  }

  async create(payload: CreateServiceDTO) {
    const newService = this.serviceRepo.create(payload);
    try {
      await this.serviceRepo.save(newService);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return newService;
  }

  async update(id: number, payload: UpdateServiceDTO) {
    const service = await this.findOne(id);
    try {
      await this.serviceRepo.merge(service, payload);
      await this.serviceRepo.save(service);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  remove(id: number) {
    return this.serviceRepo.delete(id);
  }
}
