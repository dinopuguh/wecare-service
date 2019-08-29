import {
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  InternalServerErrorException,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { ActivityService } from '../activity/activity.service';
import { ICreateDonation } from './interface/create-donation.interface';
import { Donation } from '../../models/Donation';
import { VerifyDonationDto } from './dto/verify-donation.dto';

@ApiUseTags('donation')
@Controller('donation')
export class DonationController {
  constructor(
    private readonly service: DonationService,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @Patch('activity/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('id') id: number,
    @Body() donation: CreateDonationDto,
    @CurrentUser() currentUser: User,
  ): Promise<Donation> {
    const activity = await this.activityService.findById(id, ['donations']);
    const user = await this.userService.findById(currentUser.id, ['donations']);

    const createDonation: ICreateDonation = {
      ...donation,
      activityId: activity.id,
      userId: user.id,
    };

    const saveDonation = await this.service.create(createDonation);

    const addDonationActivity = await activity.donations.push(saveDonation);

    if (!addDonationActivity) {
      throw new InternalServerErrorException(
        'Failed push donation to activity.',
      );
    }

    const addDonationUser = await user.donations.push(saveDonation);

    if (!addDonationUser) {
      throw new InternalServerErrorException('Failed push donation to user.');
    }

    const resultActivity = await this.activityService.save(activity);

    const resultUser = await this.userService.create(user);

    return saveDonation;
  }

  @Patch('verify/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async verify(@Param('id') id: number): Promise<Donation> {
    const donation = await this.service.findById(id);

    const activity = donation.activity;

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    if (!donation.isVerified) {
      donation.isVerified = true;

      activity.donationsTotal += donation.amount;
    }

    const resultDonation = await this.service.create(donation);

    const resultActivity = await this.activityService.save(activity);

    return resultDonation;
  }

  @Patch('cancel-verify/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async cancelVerify(@Param('id') id: number): Promise<Donation> {
    const donation = await this.service.findById(id);

    const activity = await this.activityService.findById(donation.activityId);

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    if (donation.isVerified) {
      donation.isVerified = false;

      activity.donationsTotal -= donation.amount;
    }

    const resultDonation = await this.service.create(donation);

    const resultActivity = await this.activityService.save(activity);

    return resultDonation;
  }
}
