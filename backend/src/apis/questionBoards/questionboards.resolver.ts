import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQuestionBoardInput } from './dto/createQuestionBoard.input';
import { UpdateQuestionBoardInput } from './dto/updateQuestionBoard.input';
import { QuestionBoard } from './entities/questionBoard.entity';
import { QuestionBoardService } from './questionboards.service';

@Resolver()
export class QuestionBoardResolver {
  constructor(
    private readonly questionBoardService: QuestionBoardService, //
  ) {}

  //QuestionBoard 생성
  @Mutation(() => QuestionBoard)
  createQuestionBoard(
    @Args('createquestionBoardInput')
    createQuestionBoardInput: CreateQuestionBoardInput, //
  ) {
    return this.questionBoardService.create({ createQuestionBoardInput });
  }

  //QuestionBoard 조회
  @Query(() => QuestionBoard)
  fetchQuestionBoard(@Args('questionboardId') questionBoardId: string) {
    return this.questionBoardService.findOne({ questionBoardId });
  }

  //QuestionBoards 전체조회 // 추후 페이징 추가 예정
  @Query(() => [QuestionBoard])
  fetchQuestionBoards() {
    return this.questionBoardService.findAll();
  }

  //QuestionBoard 업데이트
  @Mutation(() => QuestionBoard)
  async updateQuestionBoard(
    @Args('questionBoardID') questionBoardId: string,
    @Args('updatequestionBoardInput')
    updateQuestionBoardInput: UpdateQuestionBoardInput,
  ) {
    const IsquestionBoard = await this.questionBoardService.findOne({
      questionBoardId,
    });

    if (!IsquestionBoard) {
      throw new BadRequestException('해당게시물이 존재하지 않습니다.');
    }

    return this.questionBoardService.update({
      IsquestionBoard,
      updateQuestionBoardInput,
    });
  }

  //QuestionBoard 게시물 삭제
  @Mutation(() => Boolean)
  deleteQuestionBoard(@Args('boardId') boardId: string) {
    return this.questionBoardService.delete({ boardId });
  }
}
