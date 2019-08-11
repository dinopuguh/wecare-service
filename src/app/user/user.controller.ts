import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import { ApiUseTags, ApiImplicitParam, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', type: 'string' })
  findById(@Param() id: string): Promise<User> {
    return this.userService.findById(id);
  }
}
