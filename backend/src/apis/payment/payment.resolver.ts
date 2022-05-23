import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    //1. 서버에 있는지 먼저 중복 체크
    await this.paymentService.checkDuplicate({ impUid });
    //2. 아임포트에 결제 기록이 있는지 먼저 조회 하기 위해서는 토큰이 필요하다.
    const accessToken = await this.iamportService.getToken();

    //3. 받은 토큰으로 iamport 결제 정보와 DB 결제 정보 대조
    await this.iamportService.checkPaid({ impUid, amount, accessToken });

    return this.paymentService.create({
      impUid,
      amount,
      currentUser,
      product_name: '1회권',
    });
  }

  //결제 정보 불러오기(회원으로 검색)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment])
  fetchPayments(
    @CurrentUser('currentUser') CurrentUser: ICurrentUser, //
  ) {
    return this.paymentService.findAll({ CurrentUser });
  }

  // 결제정보 한 개만 불러오기
  @Query(() => Payment)
  fetchPayment(
    @Args('paymentId') paymentId: string, //
  ) {
    return this.paymentService.findOne({ paymentId });
  }

  // 결제 정보 개수 가져오기(회원으로 검색)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchPaymentsCount(
    @CurrentUser('currentUser') CurrentUser: ICurrentUser, //
  ) {
    return this.paymentService.count({ user: CurrentUser.id });
  }
}
