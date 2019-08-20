import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../models/Category';
import { CreateCategoryDto } from './dto/create.dto';
import { IService } from 'src/interfaces/IService';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo) {
    super(repo);
  }
}
