import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { UserService } from '../user/user.service';
import { User } from '../../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User])],
  providers: [ActivityService, UserService],
  controllers: [ActivityController],
  exports: [ActivityService, UserService],
})
export class ActivityModule {}
