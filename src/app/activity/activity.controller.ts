import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityService } from './activity.service';
import { Activity } from '../../models/Activity';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitFile,
  ApiConsumes,
} from '@nestjs/swagger';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ICreateActivity } from './interface/create-activity.interface';
import { UploadService } from '../upload/upload.service';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { IUpdateActivity } from './interface/update-activity.interface';
import { UserService } from '../user/user.service';

@Crud({
  model: {
    type: Activity,
  },
  routes: {
    only: ['getManyBase'],
  },
  query: {
    join: {
      campaigner: {
        allow: ['id', 'name', 'email', 'phone'],
      },
      category: {},
      type: {},
      locations: {},
      donations: {},
    },
  },
})
@ApiUseTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly service: ActivityService,
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getById(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const activity = await this.service.findById(id, ['volunteers']);

    const user = await this.userService.findById(currentUser.id, ['bookmarks']);

    const bookmarked = user.bookmarks.find(a => a.id === activity.id)
      ? true
      : false;

    const followed = (await activity.volunteers.find(v => v.userId === user.id))
      ? true
      : false;

    return {
      ...activity,
      bookmarked,
      followed,
    };
  }

  @Get('volunteers/:id')
  async getVolunteers(@Param('id') id: number): Promise<Activity> {
    const activity = await this.service.findById(id, [
      'volunteers',
      'volunteers.user',
    ]);

    return activity;
  }

  @Get('donations/:id')
  async getDonations(@Param('id') id: number): Promise<Activity> {
    const activity = await this.service.findById(id, [
      'donations',
      'donations.user',
    ]);

    return activity;
  }

  @Post()
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() photo,
    @Body() activity: CreateActivityDto,
    @CurrentUser() currentUser: User,
  ): Promise<Activity> {
    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    const createActivity: ICreateActivity = {
      ...activity,
      photo: photoUrl.secure_url,
      campaignerId: currentUser.id,
    };

    return await this.service.create(createActivity);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @Param('id') id: number,
    @Body() activityBody: UpdateActivityDto,
    @UploadedFile() photo,
  ): Promise<Activity> {
    const activity = await this.service.findById(id);

    var photoUrl = activity.photo;
    if (photo) {
      const uploadPhoto = await this.uploadService.cloudinaryImage(photo);
      photoUrl = uploadPhoto.secure_url;
    }

    const updateActivity: IUpdateActivity = {
      ...activityBody,
      photo: photoUrl,
    };

    return await this.service.update(activity.id, updateActivity);
  }
}
