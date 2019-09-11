import { Module } from '@nestjs/common';
import { WecarePointService } from './wecare-point.service';
import { WecarePointController } from './wecare-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WecarePoint } from '../../models/WecarePoint';
import { Activity } from '../../models/Activity';
import { User } from '../../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([WecarePoint, Activity, User])],
  providers: [WecarePointService],
  controllers: [WecarePointController],
})
export class WecarePointModule {}
