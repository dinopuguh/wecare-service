import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../../models/Location';
import { Activity } from '../../models/Activity';
import { ActivityService } from '../activity/activity.service';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Activity])],
  providers: [LocationService, ActivityService, UploadService],
  controllers: [LocationController],
  exports: [LocationService, ActivityService, UploadService],
})
export class LocationModule {}
