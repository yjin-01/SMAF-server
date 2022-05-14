import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBoard } from './entities/questBoard.entity';
import { QuestionBoardResolver } from './questionboards.resolver';
import { QuestionBoardService } from './questionboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionBoard, //
    ]),
  ],
  providers: [
    QuestionBoardResolver, //
    QuestionBoardService, //
  ],
})
export class QuestionBoardModule {}
