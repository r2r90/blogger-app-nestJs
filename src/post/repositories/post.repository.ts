import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../db/schemas/post.schema';
import { CreatePostDataType, CreatePostDto } from '../dto/create.post.dto';
import { NotFoundException } from '@nestjs/common';
import { PostQueryRepository } from './post-query.repository';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async createPost(createPostData: CreatePostDataType) {
    const createdAt = new Date().toISOString();
    const createdPost = new this.postModel({
      ...createPostData,
      createdAt,
    });

    const savedPost = await createdPost.save();
    return {
      id: savedPost._id,
      title: savedPost.title,
      createdAt: savedPost.createdAt,
      shortDescription: savedPost.shortDescription,
      blogId: savedPost.blogId,
      blogName: createPostData.blogName,
      content: savedPost.content,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async update(id: string, data: CreatePostDto) {
    const res = await this.postModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!res) throw new NotFoundException();
    return res;
  }

  async remove(id: string) {
    await this.postQueryRepository.findOne(id);
    const res = await this.postModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }
}
