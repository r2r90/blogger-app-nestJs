import { Blog, BlogSchema } from '../common/schemas/blog.schema';
import { Post, PostSchema } from '../common/schemas/post.schema';

export default [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
];
