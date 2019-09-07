import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../../models/User';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Phone or password is invalid');
    }
    return user;
  }
}
