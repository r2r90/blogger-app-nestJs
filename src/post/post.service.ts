import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repositories/post.repository';
import { BlogQueryRepository } from '../blog/repositories/blog.query.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PostQueryRepository } from './repositories/post.query.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const findedBlog = await this.blogQueryRepository.findOne(
      createPostDto.blogId,
    );
    if (!findedBlog) throw new NotFoundException('Cannot find blog id');

    return await this.postRepository.createPost(createPostDto, findedBlog.name);
  }

  async deletePost(id: string) {
    const postToDelete = await this.getOnePost(id);
    if (!postToDelete) throw new NotFoundException();
    const isDeleted = await this.postRepository.remove(id);
    if (!isDeleted) throw new NotFoundException('Cannot delete blog id');
    return true;
  }

  async updatePost(id: string, updateBlogData: CreatePostDto) {
    return this.postRepository.update(id, updateBlogData);
  }

  async getOnePost(id: string) {
    const finded = await this.postQueryRepository.findOne(id);
    if (!finded) throw new NotFoundException('Cannot find blog id');
    return finded;
  }

  async getAllPosts(query: PaginationInputType) {
    return this.postQueryRepository.getAll(query);
  }
}
