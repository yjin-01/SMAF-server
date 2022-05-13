import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// Access용 Guard
export class GqlAuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    console.log('djdjd');
    const ctx = GqlExecutionContext.create(context); // graphql context용을 가져와야함
    console.log('⭐️', ctx);
    return ctx.getContext().req; // graphql용
  } //context :request에 담겨오는 내용들  (header  등등..)
}

// Refresh용 Guard
export class GqlAuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context); // graphql context용을 가져와야함
    return ctx.getContext().req; // graphql용
  } //context :request에 담겨오는 내용들  (header  등등..)
}
