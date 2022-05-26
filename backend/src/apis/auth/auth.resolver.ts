import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  InternalServerErrorException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
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
    private readonly cacheManager: Cache,
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
    //
    @Context() context: any,
  ) {
    let accessToken = context.req.headers.authorization;
    let refreshToken = context.req.headers.cookie;
    let access;
    let refresh;

    accessToken = accessToken.replace('Bearer ', '');
    refreshToken = refreshToken.replace('refreshToken=', '');

    //accessToken 확인
    try {
      access = jwt.verify(accessToken, 'SMAFAccessKey', (err, decoded) => {
        if (err) {
          throw new BadRequestException('access 인증 오류');
        } else {
          return decoded;
        }
      });
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

    try {
      await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
        ttl: Math.floor(ttlforAccess),
      });

      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        refreshToken,
        {
          ttl: Math.floor(ttlforRefresh),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('redis 에러');
    }

    return '로그아웃 완료!';
  }

  // accessToken재발급
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    console.log('⭐️', currentUser);
    return this.authService.getAccessToken({
      user: {
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      },
    });
  }

  // 인증번호 생성 후 전송
  @Mutation(() => String)
  async sendTokenPhone(
    @Args('phone') phone: string, //
  ) {
    try {
      if (this.authService.checkValidationPhone(phone)) {
        const token = this.authService.getToken();
        await this.authService.sendTokenToSMS(phone, token);

        await this.cacheManager.set(phone, token, { ttl: 180 });
      }
    } catch {
      throw new InternalServerErrorException('인증번호 발송에 실패하였습니다.');
    }

    return '인증 번호 전송 완료';
  }

  // 인증번호 확인
  @Mutation(() => String)
  async checkedToekn(
    @Args('phone') phone: string, //
    @Args('inputToken') inputToken: string,
  ) {
    const redisToken = await this.cacheManager.get(phone);
    if (!redisToken)
      throw new BadRequestException(
        '입력하신 번호로 발급된 토큰이 존재하지 않습니다.',
      );
    if (redisToken === inputToken) {
      return '휴대폰 인증이 완료!👍🏻';
    }
    return '인증번호가 불일치!!😅';
  }

  // 초대이메일전송(❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️보강 필요)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  sendInvitaionEmail(
    @Args({ name: 'email', type: () => [String] }) email: string[], //
  ) {
    this.authService.sendToInvitaionEmail(email);
    return '전송완료';
  }
}
