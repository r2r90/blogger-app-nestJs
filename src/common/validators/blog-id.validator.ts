import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../db/schemas/blog.schema';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async validate(value: string): Promise<boolean> {
    const blog = await this.blogModel.findById(value);
    if (!blog) return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Blog with id:${validationArguments.value} do not exist`;
  }
}
