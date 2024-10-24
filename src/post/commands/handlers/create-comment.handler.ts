import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { CreateCommentCommand } from '../impl/create-comment.command';
import { UserQueryRepository } from '../../../user/repositories/user.query.repository';
import { PostQueryRepository } from '../../repositories/post-query.repository';
import { CommentRepository } from '../../../comment/repositories/comment.repository';
import { User } from '../../../db/schemas/users.schema';
import { Post } from '../../../db/schemas/post.schema';

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
    if (!post) throw new BadRequestException("Post doesn't exist");
    const user:User = await this.userQueryRepository.findOne(userId);
    if (!user) throw new BadRequestException('User not found');
    return await this.commentRepository.createComment({
      content,
      postId,
      userId,
      userLogin: user.login,
    });
  }
}
