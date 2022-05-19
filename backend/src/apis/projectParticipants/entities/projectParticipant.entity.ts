import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/apis/projects/entities/project.entity';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProjectParticipant {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectParticipantId: string;

  @Column()
  @Field(() => String)
  position: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isActivated: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Project)
  @Field(() => Project)
  project: Project;
}
