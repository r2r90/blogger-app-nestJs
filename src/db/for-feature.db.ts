import { Blog, BlogSchema } from './schemas/blog.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from './schemas/users.schema';

export default [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
];
