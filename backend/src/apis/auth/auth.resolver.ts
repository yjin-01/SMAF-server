import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManeger: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: any,
  ) {
    //email로 user 찾기
    const user = await this.userService.findEmailAll({ email });

    // 없는 user면 에러
    if (!email)
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다!!');

    // 비밀번호 불일치 에러
    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) throw new UnprocessableEntityException('비밀번호 불일치!!');

    // refreshToken 생성 후 프론트엔드(쿠키)에 보내주기
    this.authService.setRefreshToken({ res: context.res, user });

    // 로그인 성공 후 accessToken
    return this.authService.getAccessToken({ user });
  }

  // 로그아웃
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @CurrentUser() currentUser: ICurrentUser, //
    @Context() context: any,
  ) {
    let accessToken = context.req.headers.authorization;
    let refreshToken = context.req.headers.cookie;
    let access;
    let refresh;

    accessToken = accessToken.replace('Bearer', '');
    refreshToken = refreshToken.replace('refreshToken=', '');

    //accessToken 확인
    try {
      access = jwt.verify(
        accessToken,
        process.env.ACCESSKEY,
        (err, decoded) => {
          if (err) {
            throw new BadRequestException('access 인증 오류');
          } else {
            return decoded;
          }
        },
      );
    } catch (error) {
      console.log(error);
    }

    // refreshToken  확인
    try {
      refresh = jwt.verify(
        refreshToken,
        process.env.REFRESHKEY,
        (err, decoded) => {
          if (err) {
            throw new BadRequestException('refresh 인증 오류');
          } else {
            return decoded;
          }
        },
      );
    } catch (error) {
      console.log(error);
    }

    const date = new Date();
    const time = Number(date.getTime() / 1000);

    const ttlforAccess = Number(access.exp) - time;
    const ttlforRefresh = Number(refresh.exp) - time;

    console.log(ttlforAccess);
    console.log(ttlforRefresh);

    await this.cacheManeger.set(`accessToken:${accessToken}`, accessToken, {
      ttl: Math.floor(ttlforAccess),
    });

    await this.cacheManeger.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: Math.floor(ttlforRefresh),
    });

    return '로그아웃 완료!';
  }

  // accese
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    console.log('⭐️', currentUser);
    return this.authService.getAccessToken({ user: currentUser });
  }
}
