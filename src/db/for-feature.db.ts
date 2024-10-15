import { Blog, BlogSchema } from './schemas/blog.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from './schemas/users.schema';
import { Token, TokenSchema } from './schemas/tokens.schema';

export default [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Token.name, schema: TokenSchema },
];
