import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { User } from '../../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const data = await this.userRepository.find();
      const dataUser = data.map(({ password, ...item }) => item);

      return dataUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      const { password, ...data } = await this.userRepository.findOne(id);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
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

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validEmail(email: string): Promise<boolean> {
    try {
      if (await this.userRepository.findOne({ where: { email } })) return false;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validPhone(phone: string): Promise<boolean> {
    try {
      if (await this.userRepository.findOne({ where: { phone } })) return false;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
