import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';

@Module({
  imports: [TypeOrmModule.forFeature([Donation])],
  providers: [DonationService],
  controllers: [DonationController],
  exports: [DonationService],
})
export class DonationModule {}
