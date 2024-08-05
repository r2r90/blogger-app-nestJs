import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repositories/post.repository';
import { BlogQueryRepository } from '../blog/repositories/blog.query.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const isValidBlogId = await this.blogQueryRepository.findOne(
      createPostDto.blogId,
    );
    if (!isValidBlogId) throw new NotFoundException('Cannot find blog id');

    await this.postRepository.createPost(createPostDto);
  }

  async deletePost(id: string) {}

  async updatePost(id: string): Promise<void> {}

  async getOnePost(id: string) {
    const finded = await this.blogQueryRepository.findOne(id);
    if (!finded) throw new NotFoundException('Cannot find blog id');
    return finded;
  }

  async getAllPosts(query: PaginationInputType) {
    return this.blogQueryRepository.getAll(query);
  }
}
