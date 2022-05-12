import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectAddress } from 'src/apis/projectAddress/entities/projectAddress.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectId: string;

  @Column()
  @Field(() => String)
  projectName: string;

  @Column()
  @Field(() => String)
  projectIntro: string;

  @Column()
  @Field(() => String)
  projectDetailIntro: string;

  @Column()
  @Field(() => String)
  projectImageURL: string;

  @Column()
  @Field(() => Date)
  startDate: Date;

  @Column()
  @Field(() => Date)
  endDate: Date;

  @Column()
  @Field(() => Boolean)
  status: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // 1:1 관계(프로젝트 장소)
  @JoinColumn()
  @OneToOne(() => ProjectAddress)
  @Field(() => ProjectAddress)
  address: ProjectAddress;
}
