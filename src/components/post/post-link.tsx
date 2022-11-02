import { PostContent } from "@lib/posts";
import Link from "next/link";
import * as React from "react";

export type PostLinkProps = {
  post: Readonly<PostContent>;
};

const PostLink: React.FC<React.PropsWithChildren<PostLinkProps>> = ({
  post,
  children,
}) => {
  const url = `/posts/${post.slug}`;
  return <Link href={url} legacyBehavior>{children}</Link>;
};

export default PostLink;
