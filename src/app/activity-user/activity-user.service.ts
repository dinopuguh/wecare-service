import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityToUser } from '../../models/ActivityToUser';
import { Repository, DeleteResult } from 'typeorm';
import { CreateActivityUserDto } from './dto/create-activity-user.dto';

@Injectable()
export class ActivityUserService {
  constructor(
    @InjectRepository(ActivityToUser)
    private readonly repo: Repository<ActivityToUser>,
  ) {}

  async findById(activityId: number, userId: number): Promise<ActivityToUser> {
    const activityUser = await this.repo.findOne({
      where: { userId, activityId },
    });

    if (!activityUser) {
      return null;
    }

    return activityUser;
  }

  async create(object: CreateActivityUserDto): Promise<ActivityToUser> {
    const activityUser = await this.repo.save(object);

    if (!activityUser) {
      throw new InternalServerErrorException('Failed to save activity user.');
    }

    return activityUser;
  }

  async delete(id: number): Promise<any | boolean> {
    const deleteActivityUser = await this.repo.delete(id);

    if (!deleteActivityUser.affected) {
      return false;
    }

    return true;
  }
}
