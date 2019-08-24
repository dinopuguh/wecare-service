import {
  Controller,
  Patch,
  UseGuards,
  Param,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { ActivityService } from './activity.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';

@ApiUseTags('bookmark-activity')
@Controller('activity')
export class BookmarkActivityController {
  constructor(
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @Patch('bookmark/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async bookmarkActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.userService.findById(currentUser.id, ['bookmarks']);
    const activity = await this.activityService.findById(id);

    const bookmarked = await user.bookmarks.find(a => a.id === activity.id);

    if (bookmarked) {
      throw new BadRequestException('This activity already bookmarked.');
    }

    const addBookmark = await user.bookmarks.push(activity);

    if (!addBookmark) {
      throw new InternalServerErrorException('Failed to bookmark activity');
    }

    const result = await this.userService.create(user);

    return result;
  }

  @Patch('unbookmark/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async unbookmarkActivity(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.userService.findById(currentUser.id, ['bookmarks']);
    const activity = await this.activityService.findById(id);

    const bookmarked = await user.bookmarks.find(a => a.id === activity.id);

    if (!bookmarked) {
      throw new BadRequestException('activity bookmark not found.');
    }

    const removeBookmark = await user.bookmarks.filter(
      a => a.id !== activity.id,
    );

    if (!removeBookmark) {
      throw new InternalServerErrorException('Failed to bookmark activity');
    }

    user.bookmarks = removeBookmark;

    const result = await this.userService.create(user);

    return result;
  }
}
