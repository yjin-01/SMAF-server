import { ConsoleLogger, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  //iamport access token 발급
  async getToken() {
    try {
      const result = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_APIKEY, // REST API키
          imp_secret: process.env.IMP_SECRET, // REST API Secret
        },
      });
      return result.data.response.access_token;
    } catch (err) {
      throw new HttpException(err.res.data.message, err.res.status);
    }
  }
}
