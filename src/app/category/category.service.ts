import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../models/Category';
import { CreateCategoryDto } from './dto/create.dto';
import { IService } from 'src/interfaces/IService';

@Injectable()
export class CategoryService implements IService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<Category> {
    try {
      return await this.categoryRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
