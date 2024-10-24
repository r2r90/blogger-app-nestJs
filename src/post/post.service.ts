import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repositories/post.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PostQueryRepository } from './repositories/post-query.repository';
import { LikeStatus } from '../db/schemas';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async getAllPosts(query: PaginationInputType, userId?: string) {
    return this.postQueryRepository.getAll(query, userId);
  }

  async getOnePost(id: string, userId?: string) {
    const found = await this.postQueryRepository.getPostById(id, userId);

    if (!found) throw new NotFoundException('Cannot find blog id');
    return found;
  }

  async deletePost(id: string) {
    const postToDelete = await this.getOnePost(id);
    if (!postToDelete) throw new NotFoundException();
    const isDeleted = await this.postRepository.remove(id);
    if (!isDeleted) throw new NotFoundException('Cannot delete blog id');
    return true;
  }

  async updatePost(id: string, updatePostData: CreatePostDto) {
    return this.postRepository.update(id, updatePostData);
  }

  async likeStatus(
    userId: string,
    login: string,
    postId: string,
    likeStatus: LikeStatus,
  ) {
    const post = await this.postQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();

    const data = { userId, login, postId, likeStatus };

    return await this.postRepository.likePost(data);
  }

  async getPostComments(
    postId: string,
    query: PaginationInputType,
    userId?: string,
  ) {
    const post = await this.postQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();
    return await this.postQueryRepository.getCommentsByPostId(
      postId,
      query,
      userId,
    );
  }
}
