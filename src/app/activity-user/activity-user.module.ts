import { Module } from '@nestjs/common';
import { ActivityUserService } from './activity-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityToUser } from '../../models/ActivityToUser';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityToUser])],
  providers: [ActivityUserService],
  exports: [ActivityUserService],
})
export class ActivityUserModule {}
