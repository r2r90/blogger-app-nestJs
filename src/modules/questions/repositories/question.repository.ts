import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const newQuestion = this.questionsRepository.create({
      body: createQuestionDto.body,
      correct_answers: createQuestionDto.correctAnswers,
    });
    await this.questionsRepository.save(newQuestion);
  }

  async updateQuestion() {}
}
