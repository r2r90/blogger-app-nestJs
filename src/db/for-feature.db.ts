import {
  Blog,
  BlogSchema,
  Comment,
  CommentLike,
  CommentLikeSchema,
  CommentSchema,
  Post,
  PostLike,
  PostLikeSchema,
  PostSchema, SessionData, SessionDataSchema, Token, TokenSchema,
  User,
  UserSchema,
} from './schemas';


export default [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: PostLike.name, schema: PostLikeSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: CommentLike.name, schema: CommentLikeSchema },
  { name: Token.name, schema: TokenSchema },
  { name: SessionData.name, schema: SessionDataSchema },
];
