import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
