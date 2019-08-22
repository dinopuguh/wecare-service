import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { UserService } from '../user/user.service';
import { User } from '../../models/User';
import { LocationModule } from '../location/location.module';
import { Donation } from '../../models/Donation';
import { DonationToActivity } from '../../models/DonationToActivity';
import { DonationModule } from '../donation/donation.module';
import { DonationActivityModule } from '../donation-activity/donation-activity.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    LocationModule,
    DonationModule,
    DonationActivityModule,
  ],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
