import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionBoard } from './entities/questBoard.entity';

@Injectable()
export class QuestionBodardService {
  constructor(
    @InjectRepository(QuestionBoard)
    private readonly questionBoardRepository: Repository<QuestionBoard>,
  ) {}

  //QuestionBoard 생성
  async create({ questionBoardInput }) {
    const { userId, ...questionboardinput } = questionBoardInput;
    const result = await this.questionBoardRepository.save({
      ...questionboardinput,
      user: userId,
    });
    return result;
  }

  //QuestionBoard 한 개만 조회
  async findOne({ questionBoardId }) {
    return await this.questionBoardRepository.findOne({
      questionBoardId: questionBoardId,
    });
  }

  //QuestionBoard 전체 조회
  async findAll() {
    return await this.questionBoardRepository.find();
  }

  //QuestionBoard 삭제 : Softdelete
  async delete({ boardId }) {
    const result = await this.questionBoardRepository.softDelete({
      questionBoardId: boardId,
    });
    return result.affected ? true : false;
  }
}
