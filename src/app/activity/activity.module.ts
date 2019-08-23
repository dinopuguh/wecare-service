import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { LocationModule } from '../location/location.module';
import { DonationActivityModule } from '../donation-activity/donation-activity.module';
import { User } from '../../models/User';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, User]),
    LocationModule,
    DonationActivityModule,
  ],
  providers: [ActivityService, UserService],
  controllers: [ActivityController],
  exports: [ActivityService, UserService],
})
export class ActivityModule {}
