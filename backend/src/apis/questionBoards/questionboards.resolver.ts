import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuestionBoardInput } from './dto/questionBoard.input';
import { QuestionBoard } from './entities/questBoard.entity';
import { QuestionBodardService } from './questionboards.service';

@Resolver()
export class QuestionBodardResolver {
  constructor(
    private readonly questionBoardService: QuestionBodardService, //
  ) {}

  //QuestionBoard 생성
  @Mutation(() => QuestionBoard)
  createBoard(
    @Args('questionBoardInput') questionBoardInput: QuestionBoardInput, //
  ) {
    return this.questionBoardService.create({ questionBoardInput });
  }

  //QuestionBoard 조회
  @Query(() => QuestionBoard)
  fetchBoard(@Args('questionboardId') questionBoardId: string) {
    return this.questionBoardService.findOne({ questionBoardId });
  }

  //QuestionBoards 전체조회 // 추후 페이징 할 수도
  @Query(() => [QuestionBoard])
  fetchBoards() {
    return this.questionBoardService.findAll();
  }

  //QuestionBoard 게시물 삭제
  @Mutation(() => Boolean)
  deleteBoard(@Args('boardId') boardId: string) {
    return this.questionBoardService.delete({ boardId });
  }
}
