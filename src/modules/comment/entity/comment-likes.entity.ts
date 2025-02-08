import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { Post } from '../../post/entity/post.entity';
import { User } from '../../user/entity/user.entity';
import { Comment } from './comment.entity';

export interface ICommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  like_status: string;
  created_at: string;
}

@Entity('comment-likes')
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LikeStatus,
    default: LikeStatus.None,
    nullable: false,
  })
  like_status: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column('uuid')
  comment_id: string;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
