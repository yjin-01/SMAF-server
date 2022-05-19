import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { UpdateQuestionCommentInput } from './dto/updateQuestionComment.input';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentService } from './questionComment.service';

@Resolver()
export class QuestionCommentResolver {
  constructor(
    private readonly questionCommentService: QuestionCommentService,
  ) {}
  //QuestionComment 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => QuestionComment)
  createQuestionComment(
    @Args('contents') contents: string,
    @Args('questionboardId') questionBoardId: string,
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    this.questionCommentService.checkadmin({ userId: currentUser.id });
    return this.questionCommentService.create({
      contents,
      questionBoardId,
      currentUser,
    });
  }

  //QuestionComment 조회
  @Query(() => QuestionComment)
  fetchQuestionComment(@Args('questionCommentId') questionCommentId: string) {
    return this.questionCommentService.findOne({ questionCommentId });
  }
  //QuestionComment 전체 조회(QuestionBoardId로 검색)
  @Query(() => [QuestionComment])
  fetchQuestionComments(@Args('questionBoardId') questionBoardId: string) {
    return this.questionCommentService.findcomments({ questionBoardId });
  }

  //QuestionComment 업데이트
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => QuestionComment)
  async updateQuestionComment(
    @Args('questionCommentId') questionCommentId: string,
    @Args('updatequestionCommentInput')
    updateQuestionCommentInput: UpdateQuestionCommentInput,
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    //관리자인지 확인
    this.questionCommentService.checkadmin({
      userId: currentUser.id,
    });

    //수정할 답변이 있는지 조회
    const IsquestionComment = await this.questionCommentService.findOne({
      questionCommentId,
    });
    if (!IsquestionComment)
      throw new BadRequestException('찾으시는 답변게시물이 없습니다.');

    return this.questionCommentService.update({
      IsquestionComment,
      updateQuestionCommentInput,
    });
  }
  //QuestionComment 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteQuestionComment(
    @Args('questionCommentId') questionCommentId: string,
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    //관리자인지 확인
    this.questionCommentService.checkadmin({
      userId: currentUser.id,
    });
    return this.questionCommentService.delete({ questionCommentId });
  }
}
