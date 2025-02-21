import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 500)
  body: string;

  @IsNotEmpty()
  @IsArray()
  correctAnswers: string[];
}
