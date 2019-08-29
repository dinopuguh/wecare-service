import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Patch,
  UseGuards,
  Param,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { ActivityUserService } from '../activity-user/activity-user.service';

@ApiUseTags('follow-activity')
@Controller('activity')
export class FollowActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
    private readonly activityUserService: ActivityUserService,
  ) {}

  @Patch('follow/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async followActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.userService.findById(currentUser.id, [
      'followedActivities',
    ]);
    const activity = await this.activityService.findById(id, ['volunteers']);

    const activityUser = await this.activityUserService.findById(
      activity.id,
      user.id,
    );

    if (activityUser) {
      throw new BadRequestException('This activity already followed.');
    }

    const newActivityUser = await this.activityUserService.create({
      userId: user.id,
      activityId: activity.id,
    });

    const followed = await user.followedActivities.push(newActivityUser);
    const volunteer = await activity.volunteers.push(newActivityUser);

    if (!followed) {
      throw new InternalServerErrorException('Failed to follow activity');
    }

    if (!volunteer) {
      throw new InternalServerErrorException('Failed to follow activity');
    }

    activity.volunteersTotal = activity.volunteers.length;

    const resultActivity = await this.activityService.save(activity);

    const result = await this.userService.create(user);

    return result;
  }

  @Patch('unfollow/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async cancelFollowActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const user = await this.userService.findById(currentUser.id, [
      'followedActivities',
      'followedActivities.activity',
    ]);

    const activity = await this.activityService.findById(id, ['volunteers']);

    const activityUser = await this.activityUserService.findById(
      activity.id,
      user.id,
    );

    if (!activityUser) {
      throw new NotFoundException('Activity user relation not found.');
    }

    const result = await this.activityUserService.delete(activityUser.id);

    if (!result) {
      throw new NotFoundException('Failed to delete, relation not found.');
    }

    const unfollowActivity = await user.followedActivities.filter(
      a => a.id !== activityUser.id,
    );

    user.followedActivities = unfollowActivity;

    const cancelVolunteer = await activity.volunteers.filter(
      u => u.id !== activityUser.id,
    );

    activity.volunteers = cancelVolunteer;

    activity.volunteersTotal = activity.volunteers.length;

    const resultActivity = await this.activityService.save(activity);

    const resultUser = await this.userService.create(user);

    return resultUser;
  }
}
