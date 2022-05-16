import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateQuestionCommentInput } from './dto/updateQuestionComment.input';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentService } from './questionComment.service';

@Resolver()
export class QuestionCommentResolver {
  constructor(
    private readonly questionCommentService: QuestionCommentService,
  ) {}
  //QuestionComment 생성
  @Mutation(() => QuestionComment)
  createQuestionComment(
    @Args('contents') contents: string,
    @Args('questionboardId') questionBoardId: string,
    @Args('userId') userId: string,
  ) {
    console.log({
      contents,
      questionBoardId,
      userId,
    });
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

  //QuestionComment 업데이트
  @Mutation(() => QuestionComment)
  async updateQuestionComment(
    @Args('questionCommentId') questionCommentId: string,
    @Args('updatequestionCommentInput')
    updateQuestionCommentInput: UpdateQuestionCommentInput,
  ) {
    const IsquestionComment = await this.questionCommentService.findOne({
      questionCommentId,
    });
    if (!IsquestionComment)
      return new BadRequestException('찾으시는 답변게시물이 없습니다.');

    return this.questionCommentService.update({
      IsquestionComment,
      updateQuestionCommentInput,
    });
  }
  //QuestionComment 삭제
  @Mutation(() => Boolean)
  deleteQuestionComment(@Args('questionCommentId') questionCommentId: string) {
    return this.questionCommentService.delete({ questionCommentId });
  }
}
