import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IService } from '../../interfaces/IService';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '../../models/Type';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create.dto';

@Injectable()
export class TypeService implements IService {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    try {
      return await this.typeRepository.find();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<Type> {
    try {
      return await this.typeRepository.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(type: CreateTypeDto): Promise<Type> {
    try {
      return await this.typeRepository.save(type);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
