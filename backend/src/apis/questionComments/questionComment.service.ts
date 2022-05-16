import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionComment } from './entities/questionComment.entity';

@Injectable()
export class QuestionCommentService {
  constructor(
    @InjectRepository(QuestionComment)
    private readonly questionCommentRepository: Repository<QuestionComment>,
  ) {}

  //QuestionComment 생성
  async create({ contents, questionBoardId, userId }) {
    const result = await this.questionCommentRepository.save({
      contents: contents,
      questionBoard: questionBoardId,
      user: userId,
    });
    return result;
  }

  //QuestionComment 전체 조회
  async findAll() {
    return await this.questionCommentRepository.find();
  }

  //QuestionComment 조회
  async findOne({ questionCommentId }) {
    return await this.questionCommentRepository.findOne({
      questionCommentId: questionCommentId,
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
}
