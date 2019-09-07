import {
  Controller,
  Post,
  UseGuards,
  Body,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitFile,
  ApiConsumes,
} from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { Location } from '../../models/Location';
import { ActivityService } from '../activity/activity.service';
import { ICreateLocation } from './interfaces/create-location.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';

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
  constructor(
    private readonly service: LocationService,
    private readonly activityService: ActivityService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'licensePhoto', required: true })
  @ApiImplicitFile({ name: 'locationPhoto', required: true })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'licensePhoto', maxCount: 1 },
      { name: 'locationPhoto', maxCount: 1 },
    ]),
  )
  async addLocation(
    @UploadedFiles() files,
    @Body() location: CreateLocationDto,
    @CurrentUser() currentUser: User,
  ): Promise<Location> {
    const activity = await this.activityService.findById(location.activityId, [
      'locations',
    ]);

    const licensePhotoUrl = await this.uploadService.cloudinaryImage(
      files.licensePhoto[0],
    );

    const locationPhotoUrl = await this.uploadService.cloudinaryImage(
      files.locationPhoto[0],
    );

    const newLocation: ICreateLocation = {
      ...location,
      licensePhoto: licensePhotoUrl.secure_url,
      locationPhoto: locationPhotoUrl.secure_url,
      userId: currentUser.id,
    };

    const createLocation = await this.service.create(newLocation);

    const pushLocation = await activity.locations.push(createLocation);

    if (!pushLocation) {
      throw new InternalServerErrorException('Failed to add location.');
    }

    const result = await this.activityService.save(activity);

    return createLocation;
  }

  @Patch('verify/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async verifyLocation(@Param('id') id: number): Promise<Location> {
    const location = await this.service.findById(id);

    if (!location) {
      throw new NotFoundException('Location not found.');
    }

    location.isApproved = true;

    const verifyResult = await this.service.create(location);

    return verifyResult;
  }
}
