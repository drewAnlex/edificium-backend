import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/Product.dto';
import { Product } from '../entities/Product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      Id: 1,
      BuildingBillsID: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 122,
      quantity: 2,
      suplierId: 1,
      IsPaid: false,
    },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((item) => item.Id === id);
    return product;
  }

  create(payload: CreateProductDto) {
    const newProduct = {
      Id: this.products.length + 1,
      ...payload,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, payload: UpdateProductDto) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    const index = this.products.findIndex((item) => item.Id === id);
    this.products[index] = {
      ...this.products[index],
      ...payload,
    };
    return this.products[index];
  }

  remove(id: number) {
    if (!this.findOne(id)) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    const index = this.products.findIndex((item) => item.Id === id);
    this.products.splice(index, 1);
    return true;
  }
}
