import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class UploadService {
  cloudinaryImage(image): Promise<any> {
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
          reject(error);
        })
        .end(image.buffer);
    });
  }
}
