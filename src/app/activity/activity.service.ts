import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ICreateActivityFindVolunteers } from './interface/create-activity-volunteers.interface';
import { IUpdateActivity } from './interface/update-activity.interface';
import { ICreateActivityFindLocation } from './interface/create-activity-location.interface';
import { Like } from 'typeorm';
import { type } from 'os';

@Injectable()
export class ActivityService extends TypeOrmCrudService<Activity> {
  constructor(@InjectRepository(Activity) repo) {
    super(repo);
  }

  async findById(id: number, relations?: string[]): Promise<Activity> {
    const result = await this.repo.findOne(id, {
      relations,
    });

    if (!result) {
      throw new NotFoundException('Activity not found.');
    }

    return result;
  }

  async save(activity: Activity): Promise<Activity> {
    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException('Failed save activity.');
    }

    return result;
  }

  async create(
    activity: ICreateActivityFindVolunteers | ICreateActivityFindLocation,
  ): Promise<Activity> {
    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException('Failed create activity.');
    }

    return result;
  }

  async update(id: number, activityBody: IUpdateActivity): Promise<Activity> {
    const activity = await this.repo.findOne(id);

    const updateActivity = await this.repo.update(activity.id, activityBody);

    if (!updateActivity) {
      throw new InternalServerErrorException('Failed to update activity.');
    }

    const newActivity = await this.repo.findOne(activity.id);

    return newActivity;
  }

  async search(keyword: string): Promise<Activity[]> {
    const activities = await this.repo
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.type', 'type')
      .where('LOWER(activity.name) like :keyword', {
        keyword: '%' + keyword.toLowerCase() + '%',
      })
      .getMany();

    return activities;
  }
}
