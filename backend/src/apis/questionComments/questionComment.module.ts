import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBoard } from '../questionBoards/entities/questionBoard.entity';
import { User } from '../users/entities/users.entity';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentResolver } from './questionComment.resolver';
import { QuestionCommentService } from './questionComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionComment, //
      User, //
      QuestionBoard, //
    ]),
  ],
  providers: [
    QuestionCommentResolver, //
    QuestionCommentService, //
  ],
})
export class QuestionCommentModule {}
