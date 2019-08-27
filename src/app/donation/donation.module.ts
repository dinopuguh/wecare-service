import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';
import { User } from '../../models/User';
import { UserService } from '../user/user.service';
import { ActivityService } from '../activity/activity.service';
import { Activity } from '../../models/Activity';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, User, Activity])],
  providers: [DonationService, UserService, ActivityService],
  controllers: [DonationController],
  exports: [DonationService, UserService, ActivityService],
})
export class DonationModule {}
