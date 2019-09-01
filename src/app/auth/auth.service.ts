import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { compareSync } from 'bcrypt';
import { User } from '../../models/User';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
  ): Promise<string> {
    try {
      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = this.jwtService.sign(payload);
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async validateUser(phone: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByPhone(phone);
      if (user && (await compareSync(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(user: any): Promise<any | { status: number }> {
    try {
      const { password, ...userData } = await this.userService.findByPhone(
        user.phone,
      );
      const payload = {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
      };

      return {
        user: userData,
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
