import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityToUser } from '../../models/ActivityToUser';
import { Repository } from 'typeorm';
import { CreateActivityUserDto } from './dto/create';

@Injectable()
export class ActivityUserService {
  constructor(
    @InjectRepository(ActivityToUser)
    private readonly repo: Repository<ActivityToUser>,
  ) {}

  async create(object: CreateActivityUserDto): Promise<ActivityToUser> {
    const activityUser = await this.repo.save(object);

    if (!activityUser) {
      throw new InternalServerErrorException(
        'Failed to save donation activity.',
      );
    }

    return activityUser;
  }
}
