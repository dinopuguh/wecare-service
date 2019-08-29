import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync('.env'));
  }

  get jwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }

  get cloudinaryCloudName(): string {
    return this.envConfig.CLOUDINARY_CLOUD_NAME;
  }

  get cloudinaryApiKey(): string {
    return this.envConfig.CLOUDINARY_API_KEY;
  }

  get cloudinaryApiSecret(): string {
    return this.envConfig.CLOUDINARY_API_SECRET;
  }
}
