import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../impl/create-post.command';
import { BlogQueryRepository } from '../../../blog/repositories/blog.query.repository';
import { NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogQueryRepository: BlogQueryRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const { title, shortDescription, content, blogId } = command;
    const blog = await this.blogQueryRepository.findOneBlog(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exist");
    return await this.postRepository.createPost({
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    });
  }
}
