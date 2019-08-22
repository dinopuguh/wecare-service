import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';
import { ActivityUserModule } from '../activity-user/activity-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ActivityModule,
    ActivityUserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
