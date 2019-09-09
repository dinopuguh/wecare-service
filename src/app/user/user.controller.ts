import {
  Controller,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitFile,
  ApiConsumes,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from '../upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../custom.decorator';
import { ActivityToUser } from '../../models/ActivityToUser';
import { Activity } from '../../models/Activity';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
  },
  query: {
    join: {
      activities: {},
      locations: {},
      bookmarks: {},
      donations: {},
      'donations.activity': {},
      followedActivities: {},
      'followedActivities.activity': {},
    },
  },
})
@ApiUseTags('user')
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(
    public readonly service: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Patch('photo')
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @UploadedFile() photo,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.service.findById(currentUser.id);

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    user.photo = photoUrl.secure_url;

    return await this.service.create(user);
  }

  @Get('schedule-done/:id')
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

  @Get('schedule-undone/:id')
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

  @Get('activities-done/:id')
  async getActivitiesDone(@Param('id') id: number): Promise<Activity[]> {
    const user = await this.service.findById(id, ['activities']);

    const activities = await user.activities.filter(a => a.isDone === true);

    return activities;
  }

  @Get('activities-undone/:id')
  async getActivitiesUndone(@Param('id') id: number): Promise<Activity[]> {
    const user = await this.service.findById(id, ['activities']);

    const activities = await user.activities.filter(a => a.isDone === false);

    return activities;
  }
}
