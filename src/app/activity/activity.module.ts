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
import { WecarePoint } from '../../models/WecarePoint';
import { DonationService } from '../donation/donation.service';
import { UploadService } from '../upload/upload.service';
import { VolunteerActivityController } from './volunteer-activity.controller';
import { SearchActivityController } from './search-activity.controller';
import { WecarePointService } from '../wecare-point/wecare-point.service';
import { TypeService } from '../type/type.service';
import { Type } from '../../models/Type';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      User,
      Location,
      ActivityToUser,
      Donation,
      WecarePoint,
      Type,
    ]),
  ],
  providers: [
    ActivityService,
    UserService,
    LocationService,
    DonationService,
    ActivityUserService,
    UploadService,
    WecarePointService,
    TypeService,
  ],
  controllers: [
    ActivityController,
    FollowActivityController,
    BookmarkActivityController,
    VolunteerActivityController,
    SearchActivityController,
  ],
  exports: [
    ActivityService,
    UserService,
    LocationService,
    ActivityUserService,
    DonationService,
    UploadService,
    WecarePointService,
  ],
})
export class ActivityModule {}
