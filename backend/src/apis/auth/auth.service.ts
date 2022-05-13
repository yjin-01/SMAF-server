import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, //
    private readonly jwtService: JwtService,
  ) {}

  // refreshToken 생성 후 쿠키에 저장!!
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: process.env.REFRESHKEY, expiresIn: '2w' },
    );

    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    return refreshToken;
  }

  // accessToken토큰을 생성해서 리턴!!
  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.userId }, //
      { secret: process.env.ACCESSKEY, expiresIn: '2m' }, // 백서버에서 사용할 키와 만료 시간...?
    );

    console.log(user);

    return accessToken;
  }
}
