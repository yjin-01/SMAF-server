import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBoard } from './entities/questBoard.entity';
import { QuestionBodardResolver } from './questionboards.resolver';
import { QuestionBodardService } from './questionboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionBoard, //
    ]),
  ],
  providers: [
    QuestionBodardResolver, //
    QuestionBodardService, //
  ],
})
export class QuestionBodardModule {}
