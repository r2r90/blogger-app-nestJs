import { CreatePostDataType, CreatePostDto } from '../dto/create.post.dto';
import { PostQueryRepository } from './post-query.repository';
import {
  LikePostStatusInputDataType,
  LikeStatus,
} from '../dto/like-status.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostFromBlogDto } from '../dto/create.post.from.blog.dto';
import { IPostLike, PostLike } from '../entity/post-likes.entity';
import { Post } from '../entity/post.entity';
import { PostMapper } from '../mapper/post.mapper';
import { BadRequestException } from '@nestjs/common';

export class PostRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectRepository(Post)
    protected readonly postsRepository: Repository<Post>,
    @InjectRepository(PostLike)
    protected readonly postLikesRepository: Repository<PostLike>,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postMapper: PostMapper,
  ) {}

  async createPost(createPostData: CreatePostDataType) {
    const { title, blogId, content, shortDescription } = createPostData;

    const post = this.postsRepository.create({
      title,
      short_description: shortDescription,
      content,
      blog_id: blogId,
    });

    const savedPost = await this.postsRepository.save(post);

    const postWithBlog = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.blog', 'blog')
      .leftJoinAndSelect('post.post_likes', 'post_likes')
      .addSelect(['blog.id', 'blog.name'])
      .where('post.id = :id', { id: savedPost.id })
      .getOne();

    return await this.postMapper.mapPost(postWithBlog);
  }

  async update(id: string, data: CreatePostDto) {
    // const res = await this.postsRepository.findOneBy({ _id: id }, data, {
    //   new: true,
    // });
    // if (!res) throw new NotFoundException();
    // return res;
  }

  async removePost(id: string) {
    return await this.postsRepository.delete(id);
  }

  async updatePost(postId: string, updateData: CreatePostFromBlogDto) {
    const { title, shortDescription, content } = updateData;
    const updatePost = await this.postsRepository
      .update(
        { id: postId },
        {
          title,
          short_description: shortDescription,
          content,
        },
      )
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return !!updatePost;
  }

  async likePost(data: LikePostStatusInputDataType): Promise<any> {
    const { userId, postId, likeStatus } = data;

    const isAlreadyLiked: IPostLike =
      await this.postQueryRepository.userAlreadyLikedPost(postId, userId);

    if (isAlreadyLiked && isAlreadyLiked.like_status !== likeStatus) {
      await this.postLikesRepository.update(isAlreadyLiked.id, {
        like_status: likeStatus,
        created_at: new Date(),
      });
    }

    if (!isAlreadyLiked && likeStatus !== LikeStatus.None) {
      const likePost = this.postLikesRepository.create({
        user_id: userId,
        post_id: postId,
        like_status: likeStatus,
      });

      await this.postLikesRepository.save(likePost);
    }

    return null;
  }
}
