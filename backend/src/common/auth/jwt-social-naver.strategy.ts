import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    // 1. 검증부
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACKURL,
    });
  }

  // 2. 검증이 완료되면 실행
  validate(accessToken: string, resfreshToken: string, profile: any) {
    console.log(accessToken);
    console.log(resfreshToken);
    console.log(profile);
    return {
      // return 값은 context안의 request안 user로 들어감
      email: profile.email,
      password: '1111',
      userName: profile.name,
      phone: profile.mobile,
      userImageURL: 'asfd',
    };
  }
}
