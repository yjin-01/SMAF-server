import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionBoardInput {
  @Field(() => String)
  questionCategory: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String)
  user: string;
}
