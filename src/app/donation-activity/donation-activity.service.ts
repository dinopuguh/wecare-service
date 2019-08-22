import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationToActivity } from '../../models/DonationToActivity';
import { Repository } from 'typeorm';
import { CreateDonationActivityDto } from './dto/create';

@Injectable()
export class DonationActivityService {
  constructor(
    @InjectRepository(DonationToActivity)
    private readonly repo: Repository<DonationToActivity>,
  ) {}

  async create(object: CreateDonationActivityDto): Promise<DonationToActivity> {
    const donationActivity = await this.repo.save(object);

    if (!donationActivity) {
      throw new InternalServerErrorException(
        'Failed to save donation activity.',
      );
    }

    return donationActivity;
  }
}
