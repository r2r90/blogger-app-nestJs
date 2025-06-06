import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCommentCommand } from '../impl/create-comment.command';
import { UserQueryRepository } from '../../../user/repositories/user.query.repository';
import { PostQueryRepository } from '../../../post/repositories/post-query.repository';
import { CommentRepository } from '../../repositories/comment.repository';
import { User } from '../../../user/entity/user.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly postQueryRepository: PostQueryRepository,
    private readonly commentRepository: CommentRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const { userId, postId, content } = command;
    const post = await this.postQueryRepository.getPostById(postId);

    if (!post) throw new NotFoundException(`Post with ${postId} doesn't exist`);

    const user: User = await this.userQueryRepository.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    return await this.commentRepository.createComment({
      content,
      postId,
      userId,
      userLogin: user.login,
    });
  }
}
