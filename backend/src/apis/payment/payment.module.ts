import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
    ]),
  ],
  providers: [
    IamportService, //
    PaymentResolver, //
    PaymentService, //
  ],
})
export class PaymentModule {}
