import { PostContent } from "@lib/posts";

export function getPostUrl(post: PostContent) {
  return `/posts/${post.slug}`;
}
