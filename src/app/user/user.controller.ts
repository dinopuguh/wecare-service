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
import { Crud, CrudController } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from '../upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../custom.decorator';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
  },
  query: {
    join: {
      activities: {},
      locations: {},
      bookmarks: {},
      donations: {},
      'donations.user': {},
      followedActivities: {},
      'followedActivities.activity': {},
    },
  },
})
@ApiUseTags('user')
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(
    public readonly service: UserService,
    private readonly uploadService: UploadService,
  ) {}

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
