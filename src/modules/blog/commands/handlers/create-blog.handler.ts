import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../impl/create-blog.command';
import { BlogRepository } from '../../repositories/blog.repository';
import { BlogOutputType } from '../../mapper/blog.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: CreateBlogCommand): Promise<BlogOutputType> {
    const { name, description, websiteUrl } = command;

    return this.blogRepository.create({
      name,
      description,
      websiteUrl,
    });
  }
}
