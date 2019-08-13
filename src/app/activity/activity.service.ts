import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { TypeService } from '../type/type.service';
import { IService } from 'src/interfaces/IService';

@Injectable()
export class ActivityService implements IService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly typeService: TypeService,
  ) {}

  async findAll(): Promise<Activity[]> {
    try {
      return await this.activityRepository.find({
        relations: ['campaigner', 'category', 'type'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<Activity | undefined> {
    try {
      return await this.activityRepository.findOne(id, {
        relations: ['campaigner', 'category', 'type'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(activity: CreateActivityDto, user?: any): Promise<Activity> {
    try {
      const { password, ...campaigner } = await this.userService.findByPhone(
        user.phone,
      );
      const category = await this.categoryService.findById(activity.category);
      const type = await this.typeService.findById(activity.type);
      const newActivity = await this.activityRepository.create({
        ...activity,
        category,
        campaigner,
        type,
      });
      return await this.activityRepository.save(newActivity);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
