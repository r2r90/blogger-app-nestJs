export interface Post {
  post_id: string;
  title: string;
  short_description: string;
  content: string;
  blog_id: string;
  created_at: string;
}

export interface PostWithBlogName extends Post {
  blog_name: string;
}
