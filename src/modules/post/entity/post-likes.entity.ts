import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { Post } from './post.entity';
import { User } from '../../user/entity/user.entity';

export interface IPostLike {
  post_like_id: string;
  post_id: string;
  user_id: string;
  like_status: string;
  created_at: string;
}

@Entity('post-likes')
export class PostLike {
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

  @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column('uuid')
  post_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  user_id: string;
}
