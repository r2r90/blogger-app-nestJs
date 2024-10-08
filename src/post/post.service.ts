import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repositories/post.repository';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PostQueryRepository } from './repositories/post-query.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async getAllPosts(query: PaginationInputType) {
    return this.postQueryRepository.getAll(query);
  }


  async getOnePost(id: string) {
    const found = await this.postQueryRepository.findOne(id);
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

  async updatePost(id: string, updateBlogData: CreatePostDto) {
    return this.postRepository.update(id, updateBlogData);
  }

}
