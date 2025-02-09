import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ICreateDonation } from './interface/create-donation.interface';

@Injectable()
export class DonationService extends TypeOrmCrudService<Donation> {
  constructor(@InjectRepository(Donation) repo) {
    super(repo);
  }

  async create(donation: ICreateDonation): Promise<Donation> {
    const newDonation = this.repo.save(donation);

    if (!newDonation) {
      throw new InternalServerErrorException('Failed to save donation.');
    }

    return newDonation;
  }

  async findById(id: number, relations?: string[]): Promise<Donation> {
    const donation = await this.repo.findOne(id, {
      relations,
    });

    if (!donation) {
      return null;
    }

    return donation;
  }
}
