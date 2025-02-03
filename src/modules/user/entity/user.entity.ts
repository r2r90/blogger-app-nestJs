import { Blog } from 'src/modules/blog/entity/blog.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from '../../security-devices/entity/session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  is_admin: boolean = false;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  confirmation_code: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  recovery_code: string = null;

  @Column({ default: false })
  is_confirmed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expiration_date: Date;

  @OneToMany(() => Blog, (blog) => blog.user, { onDelete: 'CASCADE' })
  blogs: Blog[];

  @OneToMany(() => Session, (session) => session.user, { onDelete: 'CASCADE' })
  sessions: Session[];
}
