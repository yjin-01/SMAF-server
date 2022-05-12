import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  paymentId: string;

  @Column()
  @Field(() => Int)
  price: number;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
