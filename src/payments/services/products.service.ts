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
import { BuildingBillsService } from './building-bills.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private bbService: BuildingBillsService,
  ) {}

  findAll() {
    return this.productRepo.find({
      relations: ['supplierId', 'BuildingBillsID'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: ['supplierId', 'BuildingBillsID'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} Not Found`);
    }
    return product;
  }

  async findAllByBuilding(buildingId: number) {
    const products = this.productRepo.find({
      where: { building: { id: buildingId } },
    });
    if (!products) {
      throw new NotFoundException(`Products not found`);
    }
    return products;
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
