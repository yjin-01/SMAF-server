import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentService } from './questionComment.service';

@Resolver()
export class QuestionCommentResolver {
  constructor(
    private readonly questionCommentService: QuestionCommentService,
  ) {}
  //QuestionCommnet 생성
  @Mutation(() => QuestionComment)
  createQuestionComment(
    @Args('contents') contents: string,
    @Args('questionboardId') questionBoardId: string,
    @Args('userId') userId: string,
  ) {
    return this.questionCommentService.create({
      contents,
      questionBoardId,
      userId,
    });
  }

  //QuestionComment 조회
  @Query(() => QuestionComment)
  fetchQuestionComment(@Args('questionCommentId') questionCommentId: string) {
    return this.questionCommentService.findOne({ questionCommentId });
  }
  //QuestionComment 전체 조회
  @Query(() => [QuestionComment])
  fetchQuestionComments() {
    return this.questionCommentService.findAll();
  }

  //QuestionComment 삭제
  @Mutation(() => Boolean)
  deleteQuestionComment(@Args('questionCommentId') questionCommentId: string) {
    return this.questionCommentService.delete({ questionCommentId });
  }
}
