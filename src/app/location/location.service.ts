import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Location } from '../../models/Location';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateLocation } from './interfaces/create-location.interface';

@Injectable()
export class LocationService extends TypeOrmCrudService<Location> {
  constructor(@InjectRepository(Location) repo) {
    super(repo);
  }

  async create(location: Location | ICreateLocation): Promise<Location> {
    try {
      return await this.repo.save(location);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save location.');
    }
  }

  async findById(id: number): Promise<Location> {
    const location = await this.repo.findOne(id);

    if (!location) {
      return null;
    }

    return location;
  }
}
