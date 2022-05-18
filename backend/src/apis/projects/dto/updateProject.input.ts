import { Field, InputType, PartialType } from '@nestjs/graphql';
import { createProjectInput } from './createProject.input';

@InputType()
export class UpdateProjectInput extends PartialType(createProjectInput) {
  @Field(() => Boolean, { nullable: true })
  status: boolean;

  @Field(() => String, { nullable: true })
  projectColor: string;
}
