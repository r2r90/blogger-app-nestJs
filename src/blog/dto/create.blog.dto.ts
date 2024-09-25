import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../shared/decorators/custom-validators/is-not-blank.validator.';

export class CreateBlogDto {
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @IsNotBlank({ message: 'Name cannot be empty or contain only whitespace' })
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
