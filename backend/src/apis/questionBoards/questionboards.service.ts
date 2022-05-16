import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionBoard } from './entities/questionBoard.entity';

@Injectable()
export class QuestionBoardService {
  constructor(
    @InjectRepository(QuestionBoard)
    private readonly questionBoardRepository: Repository<QuestionBoard>,
  ) {}

  //QuestionBoard 생성
  async create({ createQuestionBoardInput }) {
    const { user, ...createquestionboard } = createQuestionBoardInput;
    const result = await this.questionBoardRepository.save({
      ...createquestionboard,
      user: { userId: user },
    });

    return result;
  }

  //QuestionBoard 한 개만 조회
  async findOne({ questionBoardId }) {
    return await this.questionBoardRepository.findOne({
      where: { questionBoardId: questionBoardId },
    });
  }

  //QuestionBoard 전체 조회
  async findAll() {
    return await this.questionBoardRepository.find();
  }

  //QuestionBoard update
  async update({ IsquestionBoard, updateQuestionBoardInput }) {
    const newquestionBoard = {
      ...IsquestionBoard,
      ...updateQuestionBoardInput,
    };

    return this.questionBoardRepository.save(newquestionBoard);
  }
  //QuestionBoard 삭제 : Softdelete
  async delete({ boardId }) {
    const result = await this.questionBoardRepository.softDelete({
      questionBoardId: boardId,
    });
    return result.affected ? true : false;
  }
}
