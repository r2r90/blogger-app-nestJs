import { IsString, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../shared/decorators/custom-validators/is-not-blank.validator.';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class CreatePostFromBlogDto {
  @IsString()
  @MaxLength(30)
  @IsNotBlank()
  title: string;

  @IsString()
  @MaxLength(100)
  @IsNotBlank()
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  @IsNotBlank()
  content: string;
}
