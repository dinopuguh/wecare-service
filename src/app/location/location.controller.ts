import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CreateLocationDto } from './dto/create';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { Location } from '../../models/Location';

@Crud({
  model: {
    type: Location,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
      returnDeleted: true,
    },
  },
  query: {
    join: {
      user: {
        allow: ['id', 'name', 'phone', 'email'],
      },
    },
  },
})
@ApiUseTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  // @Post()
  // @ApiBearerAuth()
  //
  // @UseGuards(AuthGuard('jwt'))
  // create(
  //   @Param('id') id: number,
  //   @Body() location: CreateLocationDto,
  //   @CurrentUser() user: User,
  // ): Promise<Location> {
  //   return this.service.create(id, location, user);
  // }
}
