import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';

@InputType()
export class createUserInput {
  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  userImageURL: string;
}
