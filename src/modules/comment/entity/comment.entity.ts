import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { User } from '../../user/entity/user.entity';
import { CommentLike } from './comment-likes.entity';

export interface IComment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: Date;
  user: User;
  commentLikes: CommentLike[];
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({
    nullable: false,
    type: 'uuid',
  })
  post_id: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    nullable: false,
    type: 'uuid',
  })
  user_id: string;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment, {
    onDelete: 'CASCADE',
  })
  commentLikes: CommentLike[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
