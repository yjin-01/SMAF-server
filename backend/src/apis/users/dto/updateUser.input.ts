import { InputType, PartialType } from '@nestjs/graphql';
import { createUserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends PartialType(createUserInput) {}
