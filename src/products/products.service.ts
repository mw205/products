import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private idCount = 1;
  constructor(private readonly categoriesService: CategoriesService) {}
  create(createProductDto: CreateProductDto) {
    const newProduct = {
      id: this.idCount++,
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);
    if (updateProductDto.categoryId) {
      this.categoriesService.findOne(updateProductDto.categoryId);
    }

    const updatedProduct = {
      ...product,
      ...updateProductDto,
    };
    this.products = this.products.map((p) =>
      p.id === id ? updatedProduct : p,
    );
    return updatedProduct;
  }

  remove(id: number) {
    this.findOne(id);
    this.products = this.products.filter((p) => p.id !== id);
  }
}
