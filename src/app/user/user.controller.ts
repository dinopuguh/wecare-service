import { Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import {
  ApiUseTags,
  ApiImplicitParam,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CurrentUser } from '../../custom.decorator';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    exclude: ['password'],
    join: {
      bookmarks: {},
    },
  },
})
@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Patch('bookmark-activity/:id')
  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'id', type: 'number' })
  @UseGuards(AuthGuard('jwt'))
  findById(@Param() id: number, @CurrentUser() user: User): Promise<User> {
    return this.service.bookmarkActivity(id, user);
  }
}
