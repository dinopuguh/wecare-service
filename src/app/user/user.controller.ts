import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Crud, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { CurrentUser } from '../../custom.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from '../activity/activity.service';
import { ActivityUserService } from '../activity-user/activity-user.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    exclude: ['password'],
    join: {
      activities: {},
      bookmarks: {},
      donations: {},
      followedActivities: {},
    },
  },
})
@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly activityService: ActivityService,
    private readonly activityUserService: ActivityUserService,
  ) {}

  @Patch('bookmark-activity/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async bookmarkActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.service.findById(currentUser.id);
    const activity = await this.activityService.findOne(id);

    if (!activity) {
      throw new NotFoundException('Activity not found.');
    }

    const bookmarked = await user.bookmarks.push(activity);

    if (!bookmarked) {
      throw new InternalServerErrorException('Failed to bookmark activity');
    }

    const result = await this.service.create(user);

    return result;
  }

  @Patch('follow-activity/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async followActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.service.findById(currentUser.id);
    const activity = await this.activityService.findOne(id);

    if (!activity) {
      throw new NotFoundException('Activity not found.');
    }

    const activityUser = await this.activityUserService.create({
      userId: user.id,
      activityId: activity.id,
    });

    const followed = await user.followedActivities.push(activityUser);

    if (!followed) {
      throw new InternalServerErrorException('Failed to follow activity');
    }

    const result = await this.service.create(user);

    return result;
  }
}
