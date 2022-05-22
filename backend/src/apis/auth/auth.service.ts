import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, //
    private readonly jwtService: JwtService,
  ) {}

  // refreshToken 생성 후 쿠키에 저장!!
  setRefreshToken({ user, res }) {
    console.log(user);
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.userId }, //
      { secret: process.env.REFRESHKEY, expiresIn: '1w' },
    );

    // 개발환경
    //res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    //배포
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.backend.smaf.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  // accessToken토큰을 생성해서 리턴!!
  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.userId, name: user.userName }, //
      { secret: process.env.ACCESSKEY, expiresIn: '24h' }, // 백서버에서 사용할 키와 만료 시간...?
    );

    console.log(user);

    return accessToken;
  }

  // 폰번호 확인
  checkValidationPhone(phone) {
    if (phone.length !== 10 && phone !== 11) {
      return new BadRequestException('핸드폰 번호 잘못됨!');
    }

    return true;
  }

  // token 생성
  getToken() {
    const result = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
    return result;
  }

  // token 발송
  async sendTokenToSMS(phone, token) {
    const appkey = process.env.SMS_APP_KEY;
    const sender = process.env.SMS_SENDER;
    const XSecretKey = process.env.SMS_X_SECRET_KEY; //.env(환경변수) 파일에 넣어주기

    const result = await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appkey}/sender/sms`,
      {
        //data
        body: `안녕하세요, 인증번호는 [${token}]입니다.`, // 문자 내용
        sendNo: sender, //발신 번호
        recipientList: [
          { internationalRecipientNo: phone }, // 수신 번호
        ],
      },
      {
        // config(headers)
        headers: {
          'content-Type': 'application/json; charset = UTF-8', // - 때문에 문자열형태로 기입해야함
          'X-Secret-Key': XSecretKey,
        },
      },
    );
    console.log(result);
    console.log('전송 완료');
  }

  // 초대 이메일 발송
  async sendToInvitaionEmail(email) {
    const appkey = process.env.EMAIL_APPKEY;
    const sender = process.env.EMAIL_SENDER;
    const XSecretKey = process.env.EMAIL_SECRETKEY; //.env(환경변수) 파일에 넣어주기

    const receiveList = email.map((el) => {
      const receiver = {
        receiveMailAddr: el,
        receiveType: 'MRT0',
      };
      return receiver;
    });
    console.log(receiveList);

    const result = await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appkey}/sender/mail`,
      {
        // body
        senderAddress: sender,
        title: `프로젝트 초대 메일`,
        body: 'test',
        receiverList: receiveList,
      },
      {
        // header
        headers: {
          'Content-Type': ' application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    console.log(result);
    console.log('전송 완료');
  }
}
