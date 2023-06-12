import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuildingAdmins } from '../entities/Admins.entity';
import { CreateAdminDTO, UpdateAdminDTO } from '../dtos/admins.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(BuildingAdmins)
    private adminsRepo: Repository<BuildingAdmins>,
  ) {}

  findAll() {
    return this.adminsRepo.find();
  }

  async findOne(id: number) {
    const admin = await this.adminsRepo.findOneBy({ id: id });
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  async findByBuilding(id: number) {
    const admin = await this.adminsRepo
      .createQueryBuilder('BuildingAdmins')
      .where('BuildingAdmins.buildingId = :id', {
        id,
      })
      .getMany();
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  async findByUser(id: number) {
    const admin = await this.adminsRepo
      .createQueryBuilder('BuildingAdmins')
      .where('BuildingAdmins.userId = :id', {
        id,
      })
      .getMany();
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  async setAdmin(admin: CreateAdminDTO) {
    const newAdmin = this.adminsRepo.create(admin);
    try {
      await this.adminsRepo.save(newAdmin);
    } catch (error) {
      throw new HttpException(
        `An error ocurred: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newAdmin;
  }

  async update(id: number, payload: UpdateAdminDTO) {
    const admin = await this.findOne(id);
    try {
      await this.adminsRepo.merge(admin, payload);
      return this.adminsRepo.save(admin);
    } catch (error) {
      throw new HttpException(
        `An Error ocurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return admin;
  }

  remove(id: number) {
    return this.adminsRepo.delete(id);
  }
}
