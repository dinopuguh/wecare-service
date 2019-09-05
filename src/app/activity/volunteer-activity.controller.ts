import {
  Controller,
  Patch,
  UseGuards,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Activity } from '../../models/Activity';
import { ActivityService } from './activity.service';
import { AbsentActivityDto } from './dto/absent-activity.dto';
import { ActivityUserService } from '../activity-user/activity-user.service';

@ApiUseTags('absent-activity')
@Controller('activity')
export class VolunteerActivityController {
  constructor(
    private readonly service: ActivityService,
    private readonly activityUserService: ActivityUserService,
  ) {}

  @Patch('absent/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async absentVolunteer(
    @Param('id') id: number,
    @Body() absentActivity: AbsentActivityDto,
  ): Promise<Activity> {
    const activity = await this.service.findById(id, ['volunteers']);

    const activityUser = await activity.volunteers.find(
      v => v.userId == absentActivity.userId,
    );

    if (!activityUser) {
      throw new NotFoundException('Volunteer not found.');
    }

    activityUser.isPresent = !activityUser.isPresent;

    const result = await this.activityUserService.create(activityUser);

    if (!result) {
      throw new InternalServerErrorException('Failed to save activity to user');
    }

    return activity;
  }
}
