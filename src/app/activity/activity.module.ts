import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { User } from '../../models/User';
import { UserService } from '../user/user.service';
import { Location } from '../../models/Location';
import { DonationToActivity } from '../../models/DonationToActivity';
import { LocationService } from '../location/location.service';
import { DonationActivityService } from '../donation-activity/donation-activity.service';
import { ActivityUserService } from '../activity-user/activity-user.service';
import { ActivityToUser } from '../../models/ActivityToUser';
import { FollowActivityController } from './follow-activity.controller';
import { BookmarkActivityController } from './bookmark-activity.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      User,
      Location,
      DonationToActivity,
      ActivityToUser,
    ]),
  ],
  providers: [
    ActivityService,
    UserService,
    LocationService,
    DonationActivityService,
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
    DonationActivityService,
    ActivityUserService,
  ],
})
export class ActivityModule {}
