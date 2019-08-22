import { Module } from '@nestjs/common';
import { DonationActivityService } from './donation-activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationToActivity } from '../../models/DonationToActivity';

@Module({
  imports: [TypeOrmModule.forFeature([DonationToActivity])],
  providers: [DonationActivityService],
  exports: [DonationActivityService],
})
export class DonationActivityModule {}
