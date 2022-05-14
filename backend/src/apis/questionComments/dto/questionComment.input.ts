import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => String)
  questionBoard: string;

  @Field(() => String)
  user: string;
}
