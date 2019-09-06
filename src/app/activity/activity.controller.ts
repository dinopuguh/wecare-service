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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
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
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
} from '@nestjsx/crud';
import { CreateActivityVolunteersDto } from './dto/create-activity-volunteers.dto';
import { ICreateActivityFindVolunteers } from './interface/create-activity-volunteers.interface';
import { UploadService } from '../upload/upload.service';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { IUpdateActivity } from './interface/update-activity.interface';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { ICreateLocation } from '../location/interfaces/create-location.interface';
import { CreateActivityLocationDto } from './dto/create-activity-location.dto';
import { ICreateActivityFindLocation } from './interface/create-activity-location.interface';
import { DoneActivityDto } from './dto/done-activity.dto';

@Crud({
  model: {
    type: Activity,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    join: {
      campaigner: {
        allow: ['id', 'name', 'email', 'phone'],
      },
      category: {},
      type: {},
      locations: {
        eager: true,
      },
      donations: {},
      'donations.user': {
        allow: ['id', 'name', 'email', 'phone'],
      },
      volunteers: {
        eager: true,
      },
    },
  },
})
@ApiUseTags('activity')
@Controller('activity')
export class ActivityController implements CrudController<Activity> {
  constructor(
    public readonly service: ActivityService,
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
    private readonly locationService: LocationService,
  ) {}

  get base(): CrudController<Activity> {
    return this;
  }

  @Override('getOneBase')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getById(
    @ParsedRequest() req: CrudRequest,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const activity = await this.base.getOneBase(req);

    const user = await this.userService.findById(currentUser.id, [
      'bookmarks',
      'locations',
    ]);

    const bookmarked = (await user.bookmarks.find(a => a.id === activity.id))
      ? true
      : false;

    const followed = (await activity.volunteers.find(v => v.userId === user.id))
      ? true
      : false;

    const location = await activity.locations.find(l => l.isApproved === true);

    return {
      ...activity,
      bookmarked,
      followed,
      location,
    };
  }

  @Post('find-volunteers')
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async createFindVolunteers(
    @UploadedFile() photo,
    @Body() activity: CreateActivityVolunteersDto,
    @CurrentUser() currentUser: User,
  ): Promise<Activity> {
    const { city, address, ...data } = activity;

    const newActivity: ICreateActivityFindVolunteers = {
      ...data,
      typeId: 1,
      campaignerId: currentUser.id,
    };

    const createActivity = await this.service.create(newActivity);

    const updatedActivity = await this.service.findById(createActivity.id, [
      'locations',
    ]);

    const newLocation: ICreateLocation = {
      city,
      address,
      // latitude,
      // longitude,
      // locationPhoto: locationPhotoUrl.secure_url,
      userId: currentUser.id,
      activityId: updatedActivity.id,
      isApproved: true,
    };

    const location = await this.locationService.create(newLocation);

    const addLocation = await updatedActivity.locations.push(location);

    if (!addLocation) {
      throw new InternalServerErrorException('Failed add location.');
    }

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    updatedActivity.photo = photoUrl.secure_url;

    const result = await this.service.save(updatedActivity);

    return result;
  }

  @Post('find-location')
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async createFindLocation(
    @UploadedFile() photo,
    @Body() activity: CreateActivityLocationDto,
    @CurrentUser() currentUser: User,
  ): Promise<Activity> {
    const newActivity: ICreateActivityFindLocation = {
      ...activity,
      typeId: 2,
      campaignerId: currentUser.id,
    };

    const createActivity = await this.service.create(newActivity);

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    createActivity.photo = photoUrl.secure_url;

    const result = await this.service.save(createActivity);

    return result;
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

  @Patch('done/:id')
  @ApiImplicitFile({ name: 'photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async doneActivity(
    @UploadedFile() photo,
    @Body() report: DoneActivityDto,
    @Param('id') id: number,
  ): Promise<Activity> {
    const activity = await this.service.findById(id);

    activity.isDone = !activity.isDone;

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    activity.reportImage = photoUrl.secure_url;

    activity.reportText = report.reportText;

    return await this.service.save(activity);
  }
}
