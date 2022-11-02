import type { PostContent } from "@lib/posts";
import Link from "next/link";
import React from "react";
import PostHeader from "./post-header";
import { getPostUrl } from "./post-link";

type Props = {
  post: Readonly<PostContent>;
};
export default function PostItem({ post }: Props) {
  return (
    <div className="">
      <PostHeader post={post} />

      {post.description && post.image ? (
        <div className="">
          <Link href={getPostUrl(post)}>
            <img
              className={
                "mx-auto mb-3 max-h-[40vh] w-[90%] rounded object-cover"
              }
              src={post.image}
              alt={post.title}
            />{" "}
          </Link>

          <div className="prose max-w-none">
            <p>{post.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
