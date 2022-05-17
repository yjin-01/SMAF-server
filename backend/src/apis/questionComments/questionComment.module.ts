import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentResolver } from './questionComment.resolver';
import { QuestionCommentService } from './questionComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionComment, //
      User, //
    ]),
  ],
  providers: [
    QuestionCommentResolver, //
    QuestionCommentService, //
  ],
})
export class QuestionCommentModule {}
