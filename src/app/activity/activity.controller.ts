import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
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
import { GetOneActivityResponse } from './response/get-one-activity.response';
import { WecarePointService } from '../wecare-point/wecare-point.service';

export enum Type {
  FIND_VOLUNTEERS = 1,
  FIND_LOCATION = 2,
}

export enum Point {
  FIND_VOLUNTEERS = 1,
  FIND_LOCATION = 2,
  FOLLOW_VOLUNTEERS = 3,
  DONATE_ACTIVITY = 4,
  SUGGEST_LOCATION = 5,
  LOCATION_VERIFIED = 6,
}

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
      'locations.user': {
        allow: [
          'id',
          'name',
          'email',
          'phone',
          'photo',
          'gender',
          'profession',
          'domicile',
        ],
      },
      donations: {},
      'donations.user': {
        allow: ['id', 'name', 'email', 'phone'],
      },
      volunteers: {
        eager: true,
      },
      'volunteers.user': {},
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
    private readonly wecarePointService: WecarePointService,
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
  ): Promise<GetOneActivityResponse> {
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
    const { city, address, latitude, longitude, ...data } = activity;

    const newActivity: ICreateActivityFindVolunteers = {
      ...data,
      typeId: Type.FIND_VOLUNTEERS,
      campaignerId: currentUser.id,
    };

    const createActivity = await this.service.create(newActivity);

    const updatedActivity = await this.service.findById(createActivity.id, [
      'locations',
    ]);

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
      typeId: Type.FIND_LOCATION,
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
    const activity = await this.service.findById(id, [
      'campaigner',
      'volunteers',
      'volunteers.user',
      'donations',
      'donations.user',
      'locations',
      'locations.user',
    ]);

    activity.isDone = true;
    activity.doneAt = new Date();

    let campaignerPoint = await this.wecarePointService.findOne(
      Point.FIND_VOLUNTEERS,
    );
    if (activity.typeId === Type.FIND_LOCATION) {
      campaignerPoint = await this.wecarePointService.findOne(
        Point.FIND_LOCATION,
      );
    }

    await this.userService.addPoint(
      activity.campaignerId,
      campaignerPoint.point,
    );

    const volunteersPoint = await this.wecarePointService.findOne(
      Point.FOLLOW_VOLUNTEERS,
    );
    const donorsPoint = await this.wecarePointService.findOne(
      Point.DONATE_ACTIVITY,
    );
    const locationsPoint = await this.wecarePointService.findOne(
      Point.SUGGEST_LOCATION,
    );
    const locationVerifiedPoint = await this.wecarePointService.findOne(
      Point.LOCATION_VERIFIED,
    );

    if (activity.volunteers.length > 0) {
      await Promise.all(
        activity.volunteers.map(async volunteer => {
          if (volunteer.isPresent) {
            return this.userService.addPoint(
              volunteer.userId,
              volunteersPoint.point,
            );
          }
        }),
      );
    }

    if (activity.donations.length > 0) {
      await Promise.all(
        activity.donations.map(async donation => {
          if (donation.isVerified) {
            return this.userService.addPoint(
              donation.userId,
              donorsPoint.point,
            );
          }
        }),
      );
    }

    if (activity.locations.length > 0) {
      await Promise.all(
        activity.locations.map(async location => {
          if (location.isApproved) {
            return this.userService.addPoint(
              location.userId,
              locationVerifiedPoint.point + locationsPoint.point,
            );
          }
        }),
      );
    }

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    activity.reportImage = photoUrl.secure_url;

    activity.reportText = report.reportText;

    return await this.service.save(activity);
  }
}
