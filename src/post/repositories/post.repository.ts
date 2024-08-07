import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../common/schemas/post.schema';
import { CreatePostDto } from '../dto/create.post.dto';
import { ObjectId } from 'mongodb';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    blogName: string,
  ): Promise<Post & { id: ObjectId }> {
    const createdAt = new Date().toISOString();
    const createdPost = new this.postModel({ ...createPostDto, createdAt });
    const savedPost = await createdPost.save();
    return {
      id: savedPost._id,
      title: savedPost.title,
      createdAt: savedPost.createdAt,
      shortDescription: savedPost.shortDescription,
      blogId: savedPost.blogId,
      content: savedPost.content,
      blogName,
    };
  }
}
