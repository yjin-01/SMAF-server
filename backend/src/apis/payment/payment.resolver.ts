import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}
  @Mutation(() => Payment)
  createPayment(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    // 나중에 current user로 대체
    @Context() context: any,
  ) {
    return this.paymentService.create({
      impUid,
      amount,
      context,
    });
  }
}
