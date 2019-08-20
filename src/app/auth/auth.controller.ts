import {
  Controller,
  Get,
  UseGuards,
  Res,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/login.dto';
import { CurrentUser } from '../../custom.decorator';
import { User } from '../../models/User';
import { IService } from 'src/interfaces/IService';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) res.json(req.user);
    else res.json({ token: null });
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Body() authLoginDto: AuthLoginDto): Promise<any> {
    return this.authService.login(authLoginDto);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.register(createUserDto);
  }

  @Get('protected')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }

  @Get('current')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  CurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
