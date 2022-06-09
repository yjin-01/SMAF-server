import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

interface IOAuthUser {
  user: Pick<User, 'email' | 'password' | 'userName'>;
}

@Controller('/')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return await this.authService.socialLogin({ res, req });
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return await this.authService.socialLogin({ res, req });
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return await this.authService.socialLogin({ res, req });
  }
}
