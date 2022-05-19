import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { QuestionBoard } from './entities/questionBoard.entity';

@Injectable()
export class QuestionBoardService {
  constructor(
    @InjectRepository(QuestionBoard)
    private readonly questionBoardRepository: Repository<QuestionBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //QuestionBoard 생성
  async create({ createQuestionBoardInput, currentUser }) {
    const user = await this.userRepository.findOne({
      where: {
        userId: currentUser.id,
      },
    });
    // const questionBoard = this.questionBoardRepository.create({
    //   ...createQuestionBoardInput,
    //   user: user.userId,
    // });
    // console.log(questionBoard);
    const result = await this.questionBoardRepository.save({
      ...createQuestionBoardInput,
      user: user,
    });

    return result;
  }

  //QuestionBoard 한 개만 조회
  async findOne({ questionBoardId }) {
    return await this.questionBoardRepository.findOne({
      where: { questionBoardId: questionBoardId },
      relations: ['user'],
    });
  }

  //QuestionBoard 전체 조회
  async findAll() {
    return await this.questionBoardRepository.find({
      relations: ['user'],
    });
  }

  //QuestionBoard update
  async update({ IsquestionBoard, updateQuestionBoardInput }) {
    const newquestionBoard = {
      ...IsquestionBoard,
      ...updateQuestionBoardInput,
    };

    return await this.questionBoardRepository.save(newquestionBoard);
  }
  //QuestionBoard 삭제 : Softdelete
  async delete({ boardId }) {
    const result = await this.questionBoardRepository.softDelete({
      questionBoardId: boardId,
    });
    return result.affected ? true : false;
  }
}
