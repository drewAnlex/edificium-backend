import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../entities/Supplier.entity';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos/Supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
  ) {}

  findAll() {
    return this.supplierRepo.find({ relations: ['products', 'buildings'] });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepo.findOne({
      where: { id: id },
      relations: ['products', 'buildings'],
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier #${id} Not Found`);
    }
    return supplier;
  }

  async create(payload: CreateSupplierDTO) {
    const newSupplier = this.supplierRepo.create(payload);
    try {
      await this.supplierRepo.save(newSupplier);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return newSupplier;
  }

  async update(id: number, payload: UpdateSupplierDTO) {
    const supplier = await this.findOne(id);
    try {
      await this.supplierRepo.merge(supplier, payload);
      await this.supplierRepo.save(supplier);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return supplier;
  }

  delete(id: number) {
    return this.supplierRepo.delete(id);
  }
}
