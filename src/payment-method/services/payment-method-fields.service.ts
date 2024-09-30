import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodFields } from '../entities/payment-method-fields.entity';
import { Repository } from 'typeorm';
import {
  PaymentMethodFieldDTO,
  UpdatePaymentMethodFieldDTO,
} from '../dtos/PaymentMethodFields.dto';

@Injectable()
export class PaymentMethodFieldsService {
  constructor(
    @InjectRepository(PaymentMethodFields)
    private repo: Repository<PaymentMethodFields>,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['methodId'] });
  }

  async findOne(id: number) {
    const field = await this.repo.findOne({
      where: { id: id },
      relations: ['methodId'],
    });
    if (!field) {
      throw new NotFoundException(`Fields not found`);
    }
    return field;
  }

  async findByMethod(id: number) {
    const fields = this.repo.find({
      where: { methodId: { id: id } },
      relations: ['methodId'],
    });
    if (!fields) {
      throw new NotFoundException(`Fields not found`);
    }
    return fields;
  }

  async create(payload: PaymentMethodFieldDTO) {
    const newField = await this.repo.create(payload);
    try {
      await this.repo.save(newField);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to create the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newField;
  }

  async update(payload: UpdatePaymentMethodFieldDTO, id: number) {
    const field = await this.findOne(id);
    try {
      this.repo.merge(field, payload);
      await this.repo.save(field);
    } catch (error) {
      throw new HttpException(
        `An error occurred while trying to update the PaymentMethodDetails: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return field;
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
