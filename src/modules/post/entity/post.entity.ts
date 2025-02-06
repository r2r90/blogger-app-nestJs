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

  @Column('uuid')
  blog_id: string;

  @ManyToOne(() => Blog, (blog) => blog.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @OneToMany(() => PostLike, (postLike) => postLike.post, {
    onDelete: 'CASCADE',
  })
  postLikes: PostLike[];
}
