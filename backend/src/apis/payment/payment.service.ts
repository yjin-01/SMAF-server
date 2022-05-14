import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PAYMENT_TRANSACTION_STATUS_ENUM,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  create({
    impUid,
    amount,
    context,
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }) {
    console.log(impUid, amount, context, status);
    // return this.paymentRepository.save({
    //   amount: amount,
    //   user: UserId,
    // });
  }
}
