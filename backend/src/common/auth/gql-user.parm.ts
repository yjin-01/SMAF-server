import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id: string;
  email: string;
  expiresIn: string;
}

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext): ICurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    // console.log(ctx.getContext().req.user);
    return ctx.getContext().req.user;
  },
);
