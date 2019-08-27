import {
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  InternalServerErrorException,
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

@ApiUseTags('donation')
@Controller('donation')
export class DonationController {
  constructor(
    private readonly service: DonationService,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() donation: CreateDonationDto,
    @CurrentUser() currentUser: User,
  ): Promise<Donation> {
    const user = await this.userService.findById(currentUser.id, ['donations']);
    const activity = await this.activityService.findById(donation.activityId, [
      'donations',
    ]);

    const createDonation: ICreateDonation = {
      ...donation,
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
}
