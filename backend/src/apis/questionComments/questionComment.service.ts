import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionBoard } from '../questionBoards/entities/questionBoard.entity';
import { User } from '../users/entities/users.entity';
import { QuestionComment } from './entities/questionComment.entity';

@Injectable()
export class QuestionCommentService {
  constructor(
    @InjectRepository(QuestionComment)
    private readonly questionCommentRepository: Repository<QuestionComment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(QuestionBoard)
    private readonly questionBoard: Repository<QuestionBoard>,
  ) {}

  //QuestionComment 생성
  async create({ contents, questionBoardId, currentUser }) {
    const user = await this.userRepository.findOne({
      where: {
        userId: currentUser.id,
      },
    });
    const board = await this.questionBoard.findOne({
      where: { questionBoardId: questionBoardId },
    });
    const result = await this.questionCommentRepository.save({
      contents: contents,
      questionBoard: board,
      user: user,
    });
    return result;
  }

  //QuestionComment 전체 조회
  async findcomments({ questionBoardId }) {
    return await this.questionCommentRepository.find({
      where: {
        questionBoard: questionBoardId,
      },
      relations: ['questionBoard', 'user'],
    });
  }

  //QuestionComment 조회
  async findOne({ questionCommentId }) {
    return await this.questionCommentRepository.findOne({
      where: { questionCommentId: questionCommentId },
      relations: ['questionBoard', 'user'],
    });
  }

  //QuestionComment 업데이트

  async update({ IsquestionComment, updateQuestionCommentInput }) {
    const newquestionComment = {
      ...IsquestionComment,
      ...updateQuestionCommentInput,
    };

    return await this.questionCommentRepository.save(newquestionComment);
  }

  //QuestionComment 삭제
  async delete({ questionCommentId }) {
    const result = await this.questionCommentRepository.softDelete({
      questionCommentId: questionCommentId,
    });

    return result.affected ? true : false;
  }

  //QuestionComment 전에 관리자 확인
  // async checkadmin({ userId }) {
  //   const user = await this.userRepository.findOne({
  //     where: { userId: userId },
  //   });

  //   return user.admin ? true : new BadRequestException('권한이 없습니다.');
  // }
}
