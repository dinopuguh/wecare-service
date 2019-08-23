import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class ActivityService extends TypeOrmCrudService<Activity> {
  constructor(@InjectRepository(Activity) repo) {
    super(repo);
  }

  async findById(id: number, relations: string[]): Promise<Activity> {
    const result = await this.repo.findOne(id, {
      relations,
    });

    if (!result) {
      throw new NotFoundException('Activity not found.');
    }

    return result;
  }

  async create(activity: Activity): Promise<Activity> {
    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException('Failed save activity.');
    }

    return result;
  }

  async replace(activity: Activity): Promise<Activity | any> {
    const result = await this.repo.update(activity.id, activity);

    if (!result) {
      throw new InternalServerErrorException('Failed replace activity.');
    }

    return result;
  }
}
