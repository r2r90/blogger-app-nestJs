import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 500,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  website_url: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_membership: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @OneToMany(() => Post, (post) => post.blog, { cascade: true })
  posts: Post[];
}
