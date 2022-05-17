import { BadRequestException, Injectable } from '@nestjs/common';
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
  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({
      where: {
        paymentId: impUid,
      },
    });
    if (!result)
      return new BadRequestException('요청하신 정보에 DB에 없습니다.');
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
