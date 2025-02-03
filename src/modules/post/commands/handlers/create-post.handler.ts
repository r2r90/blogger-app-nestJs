import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../impl/create-post.command';
import { BlogQueryRepository } from '../../../blog/repositories/blog.query.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BlogRepository } from '../../../blog/repositories/blog.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogRepository: BlogRepository,
    private blogQueryRepository: BlogQueryRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const { title, shortDescription, content, blogId } = command;
    const blog = await this.blogQueryRepository.findOneBlog(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exist");
    return await this.blogRepository.createPost({
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    });
  }
}
