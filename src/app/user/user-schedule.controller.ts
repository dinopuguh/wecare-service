import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { ApiUseTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';
import { ActivityToUser } from '../../models/ActivityToUser';

@ApiUseTags('user-schedule')
@Controller('user-schedule')
export class UserScheduleController implements CrudController<User> {
  constructor(public readonly service: UserService) {}

  @Get('done/:id')
  async getFollowedActivitiesDone(
    @Param('id') id: number,
  ): Promise<ActivityToUser[]> {
    const user = await this.service.findById(id, [
      'followedActivities',
      'followedActivities.activity',
    ]);

    const followed = await user.followedActivities.filter(
      a => a.activity.isDone === true,
    );

    return followed;
  }

  @Get('undone/:id')
  async getFollowedActivitiesUndone(
    @Param('id') id: number,
  ): Promise<ActivityToUser[]> {
    const user = await this.service.findById(id, [
      'followedActivities',
      'followedActivities.activity',
    ]);

    const followed = await user.followedActivities.filter(
      a => a.activity.isDone === false,
    );

    return followed;
  }
}
