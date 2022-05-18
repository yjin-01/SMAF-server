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
        impUid: impUid,
      },
    });
    if (result) throw new BadRequestException('이미 결제가 정보가 있습니다.');
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
