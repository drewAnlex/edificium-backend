import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contractor } from '../entities/Contractor.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateContractorDTO,
  UpdateContractorDTO,
} from '../dtos/contractor.dto';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(Contractor)
    private contractorRepo: Repository<Contractor>,
  ) {}

  findAll() {
    return this.contractorRepo.find({ relations: ['services', 'buildings'] });
  }

  async findOne(id: number) {
    const contractor = await this.contractorRepo.findOne({
      where: { id: id },
      relations: ['services', 'buildings'],
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor #${id} not found`);
    }
    return contractor;
  }

  async create(payload: CreateContractorDTO) {
    const newContractor = this.contractorRepo.create(payload);
    try {
      await this.contractorRepo.save(newContractor);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return newContractor;
  }

  async update(id: number, payload: UpdateContractorDTO) {
    const contractor = await this.findOne(id);
    try {
      await this.contractorRepo.merge(contractor, payload);
      await this.contractorRepo.save(contractor);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return contractor;
  }

  delete(id: number) {
    return this.contractorRepo.delete(id);
  }
}
