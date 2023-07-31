import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/Product.dto';
import { Product } from '../entities/Product.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find({
      relations: ['supplierId', 'BuildingBillsId'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: ['supplierId', 'BuildingBillsId'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} Not Found`);
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepo.create(payload);
    try {
      await this.productRepo.save(newProduct);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return newProduct;
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findOne(id);
    try {
      await this.productRepo.merge(product, payload);
      await this.productRepo.save(product);
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return product;
  }

  remove(id: number) {
    return this.productRepo.delete(id);
  }
}
