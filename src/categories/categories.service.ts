import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];
  private idCount = 1;

  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = {
      id: this.idCount++,
      description: createCategoryDto.description ?? '',
      ...createCategoryDto,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    const foundCategory = this.categories.find((category) => {
      return category.id === id;
    });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    return foundCategory;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const foundCategory = this.categories.find((category) => {
      return category.id === id;
    });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    const updatedCategory = {
      ...foundCategory,
      ...updateCategoryDto,
    };
    this.categories = this.categories.map((cat) =>
      cat.id === id ? updatedCategory : cat,
    );
    return updatedCategory;
  }

  remove(id: number) {
    this.findOne(id);
    this.categories = this.categories.filter((cat) => cat.id !== id);
  }
}
