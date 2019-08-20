import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { ActivityModule } from './app/activity/activity.module';
import { CategoryModule } from './app/category/category.module';
import { LocationModule } from './app/location/location.module';
import { ConfigModule } from './app/config/config.module';
import { TypeModule } from './app/type/type.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    ActivityModule,
    CategoryModule,
    LocationModule,
    ConfigModule,
    TypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
