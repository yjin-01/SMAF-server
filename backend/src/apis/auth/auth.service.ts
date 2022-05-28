import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, //
    private readonly jwtService: JwtService,
  ) {}

  setRefreshToken({ user, res }) {
    console.log(user);
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.userId }, //
      { secret: process.env.REFRESHKEY, expiresIn: '24h' },
    );

    // 개발
    //res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    //배포
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.backend.smaf.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.userId, name: user.userName }, //
      { secret: process.env.ACCESSKEY, expiresIn: '2h' },
    );

    return accessToken;
  }

  checkValidationPhone(phone: string) {
    if (phone.length !== 10 && phone.length !== 11) {
      throw new Error();
    }
    return true;
  }

  getToken() {
    const result = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
    return result;
  }

  async sendTokenToSMS(phone: string, token: string) {
    const appkey = process.env.SMS_APP_KEY;
    const sender = process.env.SMS_SENDER;
    const XSecretKey = process.env.SMS_X_SECRET_KEY;
    await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appkey}/sender/sms`,
      {
        body: `[SMAF 본인확인] 인증번호 [${token}]을 입력해주세요.`,
        sendNo: sender,
        recipientList: [{ internationalRecipientNo: phone }],
      },
      {
        headers: {
          'content-Type': 'application/json; charset = UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );
  }

  async sendToInvitaionEmail(email: string[]) {
    const appkey = process.env.EMAIL_APPKEY;
    const sender = process.env.EMAIL_SENDER;
    const XSecretKey = process.env.EMAIL_SECRETKEY;

    const receiveList = email.map((el) => {
      const receiver = {
        receiveMailAddr: el,
        receiveType: 'MRT0',
      };
      return receiver;
    });
    console.log(receiveList);

    const template = `
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- <link rel="stylesheet" href="style.css" /> -->
      <title>Document</title>
      <style>
        html,
        body,
        div,
        span,
        h1,
        p,
        a {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font-family: "Noto Sans KR";
          font-style: normal;
          vertical-align: baseline;
        }
        #wrapper {
          display: flex;
          flex-direction: column;
          width: 400px;
          height: 500px;
          /* background-color: green; */
          border: 1px solid #505050;
        }
        #titlewrapper {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 50px;
          background: #333333;
        }
  
        #logo {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
  
        #title {
          margin-top: 5px;
          font-family: "Noto Sans KR";
          font-style: normal;
          font-weight: 700;
          font-size: 32px;
          line-height: 36px;
          letter-spacing: 0.04em;
          color: #ffffff;
        }
  
        .txt {
          text-align: center;
          margin-top: 40px;
        }
  
        #linkbox {
          display: block;
          width: 300px;
          height: 50px;
          margin-top: 40px;
          margin-left: 50px;
          background-color: #ededed;
          text-align: center;
          font-size: 10px;
          line-height: 50px;
        }
  
        #bottomtxt {
          width: 240px;
          height: 30px;
          margin-top: 70px;
          margin-left: 80px;
          font-size: 10px;
          text-align: center;
          /* border: 1px solid red; */
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div id="wrapper">
        <div id="titlewrapper">
          <img src="https://storage.googleapis.com/teamproject_storage/mainClick.png" id="logo" /><img />
          <h1 id="title">SMAF</h1>
        </div>
  
        <p class="txt">안녕하세요 ❗️</p>
        <p class="txt">SMAF 팀프로젝트에 초대되었습니다.</p>
        <p class="txt">아래 링크를 클릭해 로그인해 주세요.</p>
        <p class="txt">👇🏼👇🏼👇🏼</p>
        <a href="" id="linkbox"></a>
  
        <p id="bottomtxt">
          스마프는 SMAF는 Schedule Management Assist Friend 의 약자로 일정 관리를
          도와주는 Flatform 입니다.
        </p>
      </div>
    </body>
  </html>
  
    `;

    const result = await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appkey}/sender/mail`,
      {
        senderAddress: sender,
        title: `프로젝트 초대 메일`,
        body: template,
        receiverList: receiveList,
      },
      {
        headers: {
          'Content-Type': ' application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );
  }

  async socialLogin({ res, req }) {
    const user = await this.userService.findEmail({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserInput = { ...rest, password: hashedPassword };

      await this.userService.create({ createUserInput });
    }

    this.setRefreshToken({ user, res });
    res.redirect('http://localhost:3000');
  }
}
