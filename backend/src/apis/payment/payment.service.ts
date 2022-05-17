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
  //결제 정보 중복 확인
  checkDuplicate({ impUid }) {
    const result = this.paymentRepository.findOne({
      where: {
        paymentId: impUid,
      },
    });
  }

  //결제정보 생성
  create({
    impUid,
    amount,
    currentUser,
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }) {
    console.log(impUid, amount, currentUser, status);
    // return this.paymentRepository.save({
    //   amount: amount,
    //   user: UserId,
    // });
  }
}
