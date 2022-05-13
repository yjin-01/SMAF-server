import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    // 1. 검증부
    super({
      jwtFromRequest: (req) => {
        console.log('bhfhdhd', req);
        const refreshToken = req.headers.cookie.replace('refreshToken=', '');
        return refreshToken;
      }, //jwt 추출(bearertoken만 추출)
      secretOrKey: process.env.REFRESHKEY,
      passReqToCallback: true,
    });
  }

  // 2. 검증이 완료되면 실행
  async validate(req, payload) {
    let refreshToken = req.headers.authorization;
    console.log('adfsfdas');
    console.log(refreshToken);
    refreshToken = refreshToken.replace('refreshToken=', '');

    const isRefreshToken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    console.log(isRefreshToken);

    if (isRefreshToken) throw new BadRequestException('로그인 해주세요!!');

    return {
      // return 값은 context안의 request안 user로 들어감
      id: payload.sub,
      email: payload.email,
    };
  }
}
