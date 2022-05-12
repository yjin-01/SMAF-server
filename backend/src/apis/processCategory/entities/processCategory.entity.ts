import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/apis/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProcessCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  processCategoryId: string;

  @Column()
  @Field(() => String)
  processName: string;

  @ManyToOne(() => Project)
  @Field(() => Project)
  project: Project;
}
