import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../db/schemas/post.schema';
import { CreatePostDataType, CreatePostDto } from '../dto/create.post.dto';
import { NotFoundException } from '@nestjs/common';
import { PostQueryRepository } from './post-query.repository';
import { LikeStatus, PostLike } from '../../db/schemas/post-likes.schema';
import { LikePostStatusInputDataType } from '../dto/like-status.dto';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLike>,
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
    const post = await this.postQueryRepository.getPostById(id);
    if (!post) throw new NotFoundException();
    const res = await this.postModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }

  async likePost(data: LikePostStatusInputDataType): Promise<any> {
    const { userId, postId, likeStatus } = data;
    const isAlreadyLiked = await this.postQueryRepository.userAlreadyLikedPost(
      postId,
      userId,
    );

    const likedUserData = {
      ...data,
      addedAt: new Date().toISOString(),
    };

    if (isAlreadyLiked && isAlreadyLiked.likeStatus !== likeStatus) {
      await this.postLikeModel.updateOne(
        { _id: isAlreadyLiked.id },
        { likeStatus: likeStatus, addedAt: new Date().toISOString() },
        { new: true },
      );
    }

    if (!isAlreadyLiked && likedUserData.likeStatus !== LikeStatus.None) {
      await this.postLikeModel.create(likedUserData);
    }

    return null;
  }
}
