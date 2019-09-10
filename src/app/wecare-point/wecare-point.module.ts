import { Module } from '@nestjs/common';
import { WecarePointService } from './wecare-point.service';

@Module({
  providers: [WecarePointService],
})
export class WecarePointModule {}
