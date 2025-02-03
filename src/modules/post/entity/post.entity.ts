import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PostLike } from './post-likes.entity';
import { Blog } from '../../blog/entity/blog.entity';

export interface PostInterface {
  post_id: string;
  title: string;
  short_description: string;
  content: string;
  blog_id: string;
  created_at: string;
}

export interface PostWithBlogName extends PostInterface {
  blog_name: string;
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  short_description: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column('uuid')
  blog_id: string;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];
}
