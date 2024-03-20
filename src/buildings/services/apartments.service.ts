import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment) private apartmentRepo: Repository<Apartment>,
    private userService: UsersService,
  ) {}

  async findAll() {
    return await this.apartmentRepo.find({
      relations: ['buildingId', 'userId', 'individualBills'],
    });
  }

  async findOne(id: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    return apartment;
  }

  async getApartmentsByOwner(id: number) {
    const apartments = await this.apartmentRepo.find({
      where: { userId: { id } },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartments) {
      throw new NotFoundException(`Apartments not found`);
    }
    return apartments;
  }

  async findOneByOwner(id: number, userId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id, userId: { id: userId } },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    return apartment;
  }

  async create(payload: CreateAparmentDTO) {
    const newApartment = this.apartmentRepo.create(payload);
    newApartment.uuid = uuidv4();
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

  async setApartmentToUser(uuid: string, userId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { uuid },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${uuid} not found`);
    }
    const user = await this.userService.findOne(userId);
    apartment.userId = user;
    await this.apartmentRepo.save(apartment);
    return { message: 'User assigned to apartment' };
  }
}
