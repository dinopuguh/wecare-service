import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { User } from '../../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      if (!(await this.validEmail(createUserDto.email)))
        throw new BadRequestException('Email must unique', 'email');
      if (!(await this.validUsername(createUserDto.username)))
        throw new BadRequestException('Username must unique', 'username');

      return await this.userRepository.save(createUserDto);
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

  async validUsername(username: string): Promise<boolean> {
    try {
      if (await this.userRepository.findOne({ where: { username } }))
        return false;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
