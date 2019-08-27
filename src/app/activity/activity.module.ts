import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { User } from '../../models/User';
import { UserService } from '../user/user.service';
import { Location } from '../../models/Location';
import { LocationService } from '../location/location.service';
import { ActivityUserService } from '../activity-user/activity-user.service';
import { ActivityToUser } from '../../models/ActivityToUser';
import { FollowActivityController } from './follow-activity.controller';
import { BookmarkActivityController } from './bookmark-activity.controller';
import { Donation } from '../../models/Donation';
import { DonationService } from '../donation/donation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      User,
      Location,
      ActivityToUser,
      Donation,
    ]),
  ],
  providers: [
    ActivityService,
    UserService,
    LocationService,
    DonationService,
    ActivityUserService,
  ],
  controllers: [
    ActivityController,
    FollowActivityController,
    BookmarkActivityController,
  ],
  exports: [
    ActivityService,
    UserService,
    LocationService,
    ActivityUserService,
    DonationService,
  ],
})
export class ActivityModule {}
