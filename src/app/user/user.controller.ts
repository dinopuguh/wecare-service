import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CurrentUser } from '../../custom.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from '../activity/activity.service';
import { ActivityUserService } from '../activity-user/activity-user.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'updateOneBase',
      'replaceOneBase',
      'deleteOneBase',
    ],
    updateOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    replaceOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
      returnDeleted: true,
    },
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

  @Get('bookmarked-activities/:id')
  async getBookmarked(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, ['bookmarks']);

    return user;
  }

  @Get('followed-activities/:id')
  async getFollowedActivities(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, [
      'followedActivities',
      'followedActivities.activity',
    ]);

    return user;
  }

  @Patch('bookmark-activity/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async bookmarkActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.service.findById(currentUser.id, ['bookmarks']);
    const activity = await this.activityService.findOne(id);

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
    const user = await this.service.findById(currentUser.id, [
      'followedActivities',
    ]);
    const activity = await this.activityService.findById(id, ['volunteers']);

    const activityUser = await this.activityUserService.create({
      userId: user.id,
      activityId: activity.id,
    });

    const followed = await user.followedActivities.push(activityUser);
    const volunteer = await activity.volunteers.push(activityUser);

    if (!followed) {
      throw new InternalServerErrorException('Failed to follow activity');
    }

    if (!volunteer) {
      throw new InternalServerErrorException('Failed to follow activity');
    }

    const resultActivity = await this.activityService.create(activity);

    const result = await this.service.create(user);

    return user;
  }

  @Patch('cancel-activity/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async cancelFollowActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const user = await this.service.findOne(currentUser.id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const activity = await this.activityService.findOne(id);

    if (!activity) {
      throw new NotFoundException('Activity not found.');
    }

    const result = await this.activityUserService.delete(activity.id, user.id);

    if (!result) {
      throw new NotFoundException('Failed to delete, relation not found.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Cancel follow activity success.',
    };
  }
}
