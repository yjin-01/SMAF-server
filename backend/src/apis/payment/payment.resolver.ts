import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
    private readonly iamportService: IamportService, //
  ) {}

  //Payment 데이터 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentuser: ICurrentUser,
  ) {
    //1. 아임포트에 결제 기록이 있는 먼저 조회 조회 하기 위해서는 토큰이 필요하다.
    // 토큰을 생성하기 위해서는 imp_key, imp_secret이 필요.
    const accessToken = await this.iamportService.getToken();
    console.log(accessToken);
    //checkpaid
    return this.paymentService.create({
      impUid,
      amount,
      currentuser,
    });
  }
}
