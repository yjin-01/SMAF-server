import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class QuestionBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  questionBoardId: string;

  @Column()
  @Field(() => String)
  questionCategory: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
