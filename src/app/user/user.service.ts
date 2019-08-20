import {
  Injectable,
  BadRequestException,
  HttpException,
  Param,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { CreateUserDto } from './dto/create';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    private readonly activityService: ActivityService,
  ) {
    super(repo);
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.repo.findOne(id, { relations: ['bookmarks'] });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    return user;
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    try {
      return await this.repo.findOne({
        where: { phone },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      user.password = await hashSync(user.password, 10);
      if (!(await this.validEmail(user.email)))
        throw new BadRequestException('Email must unique', 'email');
      if (!(await this.validPhone(user.phone)))
        throw new BadRequestException('Phone number must unique', 'phone');

      return await this.repo.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validEmail(email: string): Promise<boolean> {
    try {
      if (await this.repo.findOne({ where: { email } })) return false;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validPhone(phone: string): Promise<boolean> {
    try {
      if (await this.repo.findOne({ where: { phone } })) return false;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async bookmarkActivity(id: number, currentUser): Promise<any> {
    const user = await this.findById(currentUser.id);
    const activity = await this.activityService.findOne(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    if (!activity) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Activity not found.',
      });
    }

    const bookmark = await user.bookmarks.push(activity);
    const result = await this.repo.save(user);

    return { statusCode: HttpStatus.OK, data: result };
  }
}
