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

  async findById(id: number): Promise<Activity> {
    const result = await this.repo.findOne(id, {
      relations: ['locations', 'donations'],
    });

    if (!result) {
      throw new NotFoundException('Activity not found.');
    }

    return result;
  }

  async create(activity: Activity): Promise<any> {
    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }
}
