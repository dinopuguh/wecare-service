import { Get, Query, Controller } from '@nestjs/common';
import { ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { Activity } from '../../models/Activity';
import { getConnection } from 'typeorm';
import { ActivityService } from './activity.service';

@ApiUseTags('activity')
@Controller('search-activity')
export class SearchActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  @ApiImplicitQuery({ name: 'keyword', type: 'string', required: false })
  async searchActivity(@Query('keyword') keyword: string): Promise<Activity[]> {
    if (keyword) {
      return await getConnection()
        .createQueryBuilder()
        .select('activity')
        .from(Activity, 'activity')
        .where('LOWER(activity.name) like :keyword', {
          keyword: '%' + keyword.toLowerCase() + '%',
        })
        .getMany();
    }

    return this.service.find();
  }
}
