import {
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/User';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitFile,
  ApiConsumes,
} from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from '../upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../custom.decorator';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    join: {
      donations: {},
      activities: {},
    },
  },
})
@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('bookmarked-activities/:id')
  async getBookmarked(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, ['bookmarks']);

    return user;
  }

  @Get('followed-activities/:id')
  async getFollowedActivities(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, [
      'followedActivities',
      'followedActivities.activity',
    ]);

    return user;
  }

  @Get('donated-activities/:id')
  async getDonatedActivities(@Param('id') id: number): Promise<User> {
    const user = await this.service.findById(id, [
      'donations',
      'donations.user',
    ]);

    return user;
  }

  @Patch('photo')
  @ApiBearerAuth()
  @ApiImplicitFile({ name: 'photo', required: true })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @UploadedFile() photo,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.service.findById(currentUser.id);

    const photoUrl = await this.uploadService.cloudinaryImage(photo);

    user.photo = photoUrl.secure_url;

    return await this.service.create(user);
  }
}
