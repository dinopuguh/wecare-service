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
import { CreateActivityDto } from './dto/create-activity.dto';
import { ICreateActivity } from './interface/create-activity.interface';
import { UploadService } from '../upload/upload.service';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { IUpdateActivity } from './interface/update-activity.interface';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { ICreateLocation } from '../location/interfaces/create-location.interface';

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

  @Post()
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiImplicitFile({ name: 'locationPhoto', required: false })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'locationPhoto', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files,
    @Body() activity: CreateActivityDto,
    @CurrentUser() currentUser: User,
  ): Promise<Activity> {
    var { city, address, latitude, longitude, ...data } = activity;

    const photoUrl = await this.uploadService.cloudinaryImage(files.photo[0]);

    const newActivity: ICreateActivity = {
      ...data,
      photo: photoUrl.secure_url,
      campaignerId: currentUser.id,
    };

    if (Number(activity.typeId) === 1) {
      const createActivity = await this.service.create(newActivity);

      const updatedActivity = await this.service.findById(createActivity.id, [
        'locations',
      ]);

      if (!city) throw new BadRequestException('City is required.');

      if (!address) throw new BadRequestException('Address is required.');

      // const locationPhotoFile = files.locationPhoto;

      // if (!locationPhotoFile)
      //   throw new BadRequestException('Location photo is required.');

      // const locationPhotoUrl = await this.uploadService.cloudinaryImage(
      //   locationPhotoFile[0],
      // );

      const newLocation: ICreateLocation = {
        city,
        address,
        latitude,
        longitude,
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

      return this.service.save(updatedActivity);
    }

    const createActivity = await this.service.create(newActivity);

    return createActivity;
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
