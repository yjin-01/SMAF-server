import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentResolver } from './questionComment.resolver';
import { QuestionCommentService } from './questionComment.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionComment])],
  providers: [
    QuestionCommentResolver, //
    QuestionCommentService, //
  ],
})
export class QuestionCommentModule {}
