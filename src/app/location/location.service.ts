import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Location } from '../../models/Location';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocationDto } from './dto/create';

@Injectable()
export class LocationService extends TypeOrmCrudService<Location> {
  constructor(@InjectRepository(Location) repo) {
    super(repo);
  }

  async create(location: CreateLocationDto, user): Promise<any> {
    const newLocation = await this.repo.create({
      ...location,
      userId: user.id,
    });

    const result = await this.repo.save(newLocation);

    if (!result) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed create location.',
      });
    }

    return { statusCode: HttpStatus.CREATED, data: result };
  }
}
