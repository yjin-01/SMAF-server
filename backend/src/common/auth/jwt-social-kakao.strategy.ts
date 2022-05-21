import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACKURL,
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async vaildate(accessToken: string, refreshToken: string, profile: any) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      email: profile._json.kakao_account.email,
      password: '1234',
      userName: profile.username,
      phone: '12345',
      userImageURL: 'asfd',
    };
  }
}
