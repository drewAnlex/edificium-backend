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
import { BuildingBillsService } from './building-bills.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    private bbService: BuildingBillsService,
  ) {}

  findAll() {
    return this.serviceRepo.find({
      relations: ['contractorId', 'buildingBillId'],
    });
  }

  async findAllByBuildingBillId(uuid: string) {
    const services = await this.serviceRepo.find({
      where: {
        buildingBillId: { uuid: uuid },
      },
    });
    if (!services) {
      throw new NotFoundException(`Services not found`);
    }
    return services;
  }

  async findAllByBuilding(buildingId: number) {
    const services = await this.serviceRepo.find({
      where: { building: { id: buildingId } },
    });
    if (!services) {
      throw new NotFoundException(`Services not found`);
    }
    return services;
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

  async findOneByBuildingBillId(id: number, uuid: string) {
    const service = await this.serviceRepo.findOne({
      where: {
        id: id,
        buildingBillId: { uuid: uuid },
      },
      relations: ['contractorId', 'buildingBillId'],
    });
    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return service;
  }

  async create(payload: CreateServiceDTO) {
    try {
      const newService = this.serviceRepo.create(payload);
      await this.serviceRepo.save(newService);
      return newService;
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
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
