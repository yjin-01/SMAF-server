import { Field, ObjectType } from '@nestjs/graphql';
import { ProcessCategory } from 'src/apis/processCategory/entities/processCategory.entity';
import { Project } from 'src/apis/projects/entities/project.entity';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  scheduleId: string;

  @Column()
  @Field(() => String)
  scheduleName: string;

  @Column()
  @Field(() => Date)
  scheduleDate: Date;

  @ManyToOne(() => ProcessCategory)
  @Field(() => ProcessCategory)
  processCategory: ProcessCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Project)
  @Field(() => Project)
  project: Project;
}
