import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create.dto';
import * as bcrypt from 'bcrypt';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  constructor(private readonly userService: UserService) {}

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

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && bcrypt.compare(user.password, password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any | { status: number }> {
    const payload = { username: user.username, sub: user.id };
    const userData = await this.userService.findByUsername(user.username);
    return {
      statusCode: 200,
      data: userData,
      accessToken: sign(payload, this.JWT_SECRET_KEY),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.create(createUserDto);
  }
}
