import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create';
import { compareSync } from 'bcrypt';
import { User } from '../../models/User';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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

      const jwt: string = sign(payload, this.JWT_SECRET_KEY, {
        expiresIn: 3600,
      });
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
        phone: userData.phone,
        email: userData.email,
      };
      return {
        statusCode: 200,
        data: { user: userData, accessToken: this.jwtService.sign(payload) },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
