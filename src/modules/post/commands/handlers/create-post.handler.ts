import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../impl/create-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { BlogQueryRepository } from '../../../blog/repositories/blog.query.repository';
import { BadRequestException } from '@nestjs/common';
import { Blog } from '../../../../db/schemas/blog.schema';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postRepository: PostRepository,
    private blogQueryRepository: BlogQueryRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const { title, shortDescription, content, blogId } = command;
    const blog = await this.blogQueryRepository.findOne(blogId);
    if (!blog) throw new BadRequestException("Blog doesn't exist");
    return await this.postRepository.createPost({
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    });
  }
}
