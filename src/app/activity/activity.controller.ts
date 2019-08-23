import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from '../../models/Activity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { CreateLocationDto } from '../location/dto/create';
import { LocationService } from '../location/location.service';
import { DonationActivityService } from '../donation-activity/donation-activity.service';
import { ICreateLocation } from '../location/interfaces/create-location.interface';
import { AddDonationDto } from './dto/add-donation';
import { IAddDonation } from './interface/add-donation.interface';
import { UserService } from '../user/user.service';

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
    private readonly userService: UserService,
    private readonly donationActivityService: DonationActivityService,
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
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() activity: Activity,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return await this.service.create({
      ...activity,
      campaignerId: user.id,
    });
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

    const result = await this.service.create(activity);

    return result;
  }

  @Patch('add-donation/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async addDonation(
    @Param('id') id: number,
    @Body() donation: AddDonationDto,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const activity = await this.service.findById(id, ['donations']);
    const user = await this.userService.findById(currentUser.id, [
      'donatedActivities',
    ]);

    const newDonation: IAddDonation = {
      ...donation,
      userId: user.id,
      activityId: activity.id,
    };

    const donationActivity = await this.donationActivityService.create(
      newDonation,
    );

    const donations = await activity.donations.push(donationActivity);

    if (!donations) {
      throw new InternalServerErrorException(
        'Failed to add donation to activity.',
      );
    }

    const donated = await user.donatedActivities.push(donationActivity);

    if (!donated) {
      throw new InternalServerErrorException('Failed to add donation to user.');
    }

    const resultUser = await this.userService.create(user);
    const resultActivity = await this.service.create(activity);

    return activity;
  }
}
