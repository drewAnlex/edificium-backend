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

  async findAllByBuilding(buildingId: number) {
    const contractors = await this.contractorRepo.find({
      where: { building: { id: buildingId } },
    });
    if (!contractors) {
      throw new NotFoundException(`Contractor not found`);
    }
    return contractors;
  }

  async findOneByBuilding(contractorId: number, buildingId: number) {
    const contractor = await this.findOne(contractorId);
    if (contractor.building.id != buildingId) {
      throw new NotFoundException(`Contractor Not Found`);
    }
    return contractor;
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

  async create(payload: CreateContractorDTO, buildingId: number) {
    const newContractor = this.contractorRepo.create(payload);
    newContractor.building.id = buildingId;
    try {
      await this.contractorRepo.save(newContractor);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return newContractor;
  }

  async update(id: number, payload: UpdateContractorDTO, buildingId: number) {
    const contractor = await this.findOneByBuilding(id, buildingId);
    try {
      await this.contractorRepo.merge(contractor, payload);
      await this.contractorRepo.save(contractor);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return contractor;
  }

  async delete(id: number, buildingId: number) {
    await this.findOneByBuilding(id, buildingId);
    return this.contractorRepo.delete(id);
  }
}
