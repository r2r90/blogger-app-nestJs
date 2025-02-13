import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogQueryRepository } from '../../../modules/blog/repositories/blog.query.repository';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}

  async validate(blogId: string): Promise<boolean> {
    if (blogId && blogId.match(/^[0-9a-fA-F]{24}$/)) {
      const isValidBLog = await this.blogQueryRepository.findOneBlog(blogId);
      if (isValidBLog) {
        return true;
      }
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Blog with id:${validationArguments.value} do not exist`;
  }
}
