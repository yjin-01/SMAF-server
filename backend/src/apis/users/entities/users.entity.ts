import { Field, Int, ObjectType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  userName: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  userImageURL: string;

  @Column({ default: 2 })
  @Field(() => Int)
  projectTicket: number;

  @Column({ default: false })
  @Field(() => Boolean)
  admin: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
