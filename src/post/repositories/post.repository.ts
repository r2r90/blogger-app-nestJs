import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../common/schemas/post.schema';
import { CreatePostDto } from '../dto/create.post.dto';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const createdAt = new Date().toISOString();
    const createdPost = new this.postModel({ ...createPostDto, createdAt });
    return await createdPost.save();
  }
}
