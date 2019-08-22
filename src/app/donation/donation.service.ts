import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Donation } from '../../models/Donation';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDonationDto } from './dto/create';
import { UserService } from '../user/user.service';
import { ICreateDonation } from './interfaces/create-donation.interface';

@Injectable()
export class DonationService extends TypeOrmCrudService<Donation> {
  constructor(@InjectRepository(Donation) repo) {
    super(repo);
  }

  async create(donation: ICreateDonation): Promise<Donation> {
    try {
      return await this.repo.save(donation);
    } catch (error) {
      throw new InternalServerErrorException('Failed save donation.');
    }
  }
}
