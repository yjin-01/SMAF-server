import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProjectAddress {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectAddressId: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  detailAddress: string;
}
