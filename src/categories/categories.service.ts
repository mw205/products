import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }
  findAll() {
    return this.categoryModel.find();
  }
  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedcategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    if (!updatedcategory) {
      throw new NotFoundException('Category not found');
    }
    return updatedcategory;
  }

  async remove(id: string) {
    const removedcategory = await this.categoryModel.findByIdAndDelete(id);
    if (!removedcategory) {
      throw new NotFoundException('Category not found');
    }
    return removedcategory;
  }
}
