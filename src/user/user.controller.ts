import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}
  @Get()
  async findAll() {
    return await this.service.findAll();
  }
}
