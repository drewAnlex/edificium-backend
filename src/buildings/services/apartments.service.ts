import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment) private apartmentRepo: Repository<Apartment>,
  ) {}

  async findAll() {
    return await this.apartmentRepo.find({
      relations: ['buildingId', 'userId'],
    });
  }

  async findOne(id: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id },
      relations: ['buildingId', 'userId'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    return apartment;
  }

  async create(payload: CreateAparmentDTO) {
    const newApartment = this.apartmentRepo.create(payload);
    try {
      await this.apartmentRepo.save(newApartment);
    } catch (error) {
      throw new HttpException(
        `Creation Error ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newApartment;
  }

  async update(id: number, payload: UpdateAparmentDTO) {
    const apartment = await this.findOne(id);
    try {
      await this.apartmentRepo.merge(apartment, payload);
      await this.apartmentRepo.save(apartment);
    } catch (error) {
      throw new HttpException(`Update Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return apartment;
  }

  remove(id: number) {
    return this.apartmentRepo.delete(id);
  }
}
