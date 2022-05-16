import { InputType, PartialType } from '@nestjs/graphql';
import { createProjectInput } from './createProject.input';

@InputType()
export class UpdateProjectInput extends PartialType(createProjectInput) {}
