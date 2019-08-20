import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { CreateActivityDto } from './dto/create';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class ActivityService extends TypeOrmCrudService<Activity> {
  constructor(@InjectRepository(Activity) repo) {
    super(repo);
  }

  async create(activity: CreateActivityDto, user): Promise<any> {
    const newActivity = await this.repo.create({
      ...activity,
      campaignerId: user.id,
    });

    const result = await this.repo.save(newActivity);

    if (!result) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed create activity.',
      });
    }

    return { statusCode: HttpStatus.CREATED, data: result };
  }
}
