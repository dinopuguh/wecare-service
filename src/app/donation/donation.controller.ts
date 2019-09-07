import {
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  InternalServerErrorException,
  Patch,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitFile,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { ActivityService } from '../activity/activity.service';
import { ICreateDonation } from './interface/create-donation.interface';
import { Donation } from '../../models/Donation';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: Donation,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
  query: {
    join: {
      activity: {},
      user: {
        allow: ['id', 'name', 'email', 'phone'],
      },
    },
  },
})
@ApiUseTags('donation')
@Controller('donation')
export class DonationController {
  constructor(
    private readonly service: DonationService,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'transferValidation', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('transferValidation'))
  async create(
    @UploadedFile() transferValidation,
    @Body() donation: CreateDonationDto,
    @CurrentUser() currentUser: User,
  ): Promise<Donation> {
    const activity = await this.activityService.findById(donation.activityId, [
      'donations',
    ]);

    const user = await this.userService.findById(currentUser.id, ['donations']);

    const transferValidationUrl = await this.uploadService.cloudinaryImage(
      transferValidation,
    );

    const createDonation: ICreateDonation = {
      ...donation,
      transferValidation: transferValidationUrl.secure_url,
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

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    const activity = await this.activityService.findById(donation.activityId);

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

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    const activity = await this.activityService.findById(donation.activityId);

    if (donation.isVerified) {
      donation.isVerified = false;

      activity.donationsTotal -= donation.amount;
    }

    const resultDonation = await this.service.create(donation);

    const resultActivity = await this.activityService.save(activity);

    return resultDonation;
  }
}
