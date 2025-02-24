import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionRepository } from './repositories/question.repository';
import { QuestionQueryRepository } from './repositories/question.query.repository';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRepository, QuestionQueryRepository],
  imports: [TypeOrmModule.forFeature([Question])],
})
export class QuestionsModule {}
