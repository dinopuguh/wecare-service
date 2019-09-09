import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { ApiUseTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';
import { Activity } from '../../models/Activity';

@ApiUseTags('user-activities')
@Controller('user-activities')
export class UserActivitiesController implements CrudController<User> {
  constructor(public readonly service: UserService) {}

  @Get('done/:id')
  async getActivitiesDone(@Param('id') id: number): Promise<Activity[]> {
    const user = await this.service.findById(id, [
      'activities',
      'activities.campaigner',
    ]);

    const activities = await user.activities.filter(a => a.isDone === true);

    return activities;
  }

  @Get('undone/:id')
  async getActivitiesUndone(@Param('id') id: number): Promise<Activity[]> {
    const user = await this.service.findById(id, [
      'activities',
      'activities.campaigner',
    ]);

    const activities = await user.activities.filter(a => a.isDone === false);

    return activities;
  }
}
