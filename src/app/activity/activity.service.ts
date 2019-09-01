import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ICreateActivity } from './interface/create-activity.interface';
import * as cloudinary from 'cloudinary';

@Injectable()
export class ActivityService extends TypeOrmCrudService<Activity> {
  constructor(@InjectRepository(Activity) repo) {
    super(repo);
  }

  async findById(id: number, relations?: string[]): Promise<Activity> {
    const result = await this.repo.findOne(id, {
      relations,
    });

    if (!result) {
      throw new NotFoundException('Activity not found.');
    }

    return result;
  }

  async save(activity: Activity): Promise<Activity> {
    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException('Failed save activity.');
    }

    return result;
  }

  async create(activity: ICreateActivity): Promise<Activity> {
    // const photo = await this.upload(activity.photo);

    // activity.photo = photo.secure_url;

    const result = await this.repo.save(activity);

    if (!result) {
      throw new InternalServerErrorException('Failed save activity.');
    }

    return result;
  }

  upload(image): Promise<any> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    return new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream((error, result) => {
          if (result) resolve(result);
          reject(result);
        })
        .end(image.buffer);
    });
  }
}
