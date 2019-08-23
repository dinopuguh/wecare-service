import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { CreateUserDto } from './dto/create';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }

  async findById(id: number, relations: string[]): Promise<User | undefined> {
    const user = await this.repo.findOne(id, {
      relations,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
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

  async register(user: CreateUserDto): Promise<User> {
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

  async create(user: User): Promise<User> {
    const result = await this.repo.save(user);

    if (!result) {
      throw new InternalServerErrorException('Failed to save user.');
    }

    return result;
  }

  async replace(user: User): Promise<User | any> {
    const result = await this.repo.update(user.id, user);

    if (!result) {
      throw new InternalServerErrorException('Failed replace user.');
    }

    return result;
  }
}
