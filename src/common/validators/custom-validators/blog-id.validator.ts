import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../../db/schemas/blog.schema';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async validate(blogId: string): Promise<boolean> {
    if (blogId && blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return this.blogModel.findById(blogId);
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Blog with id:${validationArguments.value} do not exist`;
  }
}
