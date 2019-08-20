import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from '../../models/Activity';
import { ApiUseTags, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateActivityDto } from './dto/create';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';

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
    },
  },
})
@ApiUseTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() activity: CreateActivityDto,
    @CurrentUser() user: User,
  ): Promise<Activity> {
    return this.service.create(activity, user);
  }
}
