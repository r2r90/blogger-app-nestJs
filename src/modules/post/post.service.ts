import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repositories/post.repository';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import { PostQueryRepository } from './repositories/post-query.repository';
import { CreatePostFromBlogDto } from './dto/create.post.from.blog.dto';
import { UserService } from '../user/user.service';
import { GetPostsByBlogIdDto } from './dto/get-posts-by-blog-id.dto';
import { CommentQueryRepository } from '../comment/repositories/comment.query.repository';
import { LikeStatus } from './dto/like-status.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  async getAllPosts(query: PaginationInputType, userId?: string) {
    return this.postQueryRepository.getAllPosts(
      query as GetPostsByBlogIdDto,
      userId,
    );
  }

  async getOnePost(id: string, userId?: string) {
    const found = await this.postQueryRepository.getPostById(id, userId);
    if (!found) throw new NotFoundException('Cannot find post id');
    return found;
  }

  async deletePost(id: string) {
    const postToDelete = await this.getOnePost(id);
    if (!postToDelete) throw new NotFoundException();
    const isDeleted = await this.postRepository.removePost(id);
    if (!isDeleted) throw new NotFoundException('Cannot delete blog id');
    return true;
  }

  async updatePost(id: string, updatePostData: CreatePostDto) {
    return this.postRepository.update(id, updatePostData);
  }

  async likeStatus(userId: string, postId: string, likeStatus: LikeStatus) {
    const post = await this.postQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Cannot find user');

    const data = { userId, postId, likeStatus };

    return await this.postRepository.likePost(data);
  }

  async getPostComments(
    postId: string,
    query: PaginationInputType,
    userId?: string,
  ) {
    const post = await this.getOnePost(postId);

    if (!post) throw new NotFoundException();

    console.log('hello');

    return await this.commentQueryRepository.getCommentsByPostId(
      postId,
      query,
      userId,
    );
  }

  async updatePostByBlogId(
    blogId: string,
    postId: string,
    updateData: CreatePostFromBlogDto,
  ) {
    const post = await this.postQueryRepository.getPostById(postId);
    if (!post || post.blogId !== blogId) throw new NotFoundException();
    return this.postRepository.updatePost(postId, updateData);
  }

  async deletePostByBlogId(blogId: string, postId: string) {
    const post = await this.postQueryRepository.getPostById(postId);
    if (!post || post.blogId !== blogId) throw new NotFoundException();
    return this.postRepository.removePost(postId);
  }
}
