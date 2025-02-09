import { Get, Query, Controller } from '@nestjs/common';
import { ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { Activity } from '../../models/Activity';
import { ActivityService } from './activity.service';

@ApiUseTags('activity')
@Controller('search-activity')
export class SearchActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  @ApiImplicitQuery({ name: 'keyword', type: 'string', required: false })
  async searchActivity(@Query('keyword') keyword: string): Promise<any[]> {
    if (keyword) {
      return this.service.search(keyword);
    }

    return this.service.find({ relations: ['type'] });
  }
}
