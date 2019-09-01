import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { ActivityToUser } from '../../models/ActivityToUser';
import { ActivityService } from '../activity/activity.service';
import { ActivityUserService } from '../activity-user/activity-user.service';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Activity, ActivityToUser])],
  controllers: [UserController],
  providers: [UserService, ActivityService, ActivityUserService, UploadService],
  exports: [UserService, ActivityService, ActivityUserService, UploadService],
})
export class UserModule {}
