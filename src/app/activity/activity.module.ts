import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../models/Activity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { TypeModule } from '../type/type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    CategoryModule,
    UserModule,
    TypeModule,
  ],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
