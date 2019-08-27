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
  BadRequestException,
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
  constructor(private readonly service: UserService) {}

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

  @Get('donated-activities/:id')
  async getDonatedActivities(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, [
      'donations',
      'donations.user',
    ]);

    return user;
  }
}
