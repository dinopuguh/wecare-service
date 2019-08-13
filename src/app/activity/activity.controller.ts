import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from '../../models/Activity';
import { ApiUseTags, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateActivityDto } from './dto/create.dto';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { AuthGuard } from '@nestjs/passport';
import { IService } from 'src/interfaces/IService';

@ApiUseTags('activity')
@Controller('activity')
export class ActivityController implements IService {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', type: 'string' })
  findById(@Param() id: string): Promise<Activity> {
    return this.activityService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() activity: CreateActivityDto,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return this.activityService.create(activity, user);
  }
}
