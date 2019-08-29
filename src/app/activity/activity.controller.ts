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
import { CreateLocationDto } from '../location/dto/create';
import { LocationService } from '../location/location.service';
import { ICreateLocation } from '../location/interfaces/create-location.interface';
import { CreateActivityDto } from './dto/create';
import { ICreateActivity } from './interface/create-activity.interface';

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
    private readonly locationService: LocationService,
  ) {}

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
    // console.log(photo);

    const createActivity: ICreateActivity = {
      ...activity,
      photo: photo,
      campaignerId: currentUser.id,
    };

    return await this.service.create(createActivity);
  }

  @Patch('add-location/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async addLocation(
    @Param('id') id: number,
    @Body() location: CreateLocationDto,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const activity = await this.service.findById(id, ['locations']);

    const newLocation: ICreateLocation = {
      ...location,
      userId: currentUser.id,
    };

    const createLocation = await this.locationService.create(newLocation);

    const pushLocation = await activity.locations.push(createLocation);

    if (!pushLocation) {
      throw new InternalServerErrorException('Failed to add location.');
    }

    const result = await this.service.save(activity);

    return result;
  }
}
