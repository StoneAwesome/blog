import type { PostContent } from "@lib/posts";
import React from "react";
import PostHeader from "./post-header";
import PostLink from "./post-link";

type Props = {
  post: Readonly<PostContent>;
};
export default function PostItem({ post }: Props) {
  return (
    <div className="">
      <PostHeader post={post} />

      {post.description && post.image ? (
        <div className="">
          <PostLink post={post}>
            <a>
              <img
                className={
                  "mb-3 max-h-[60vh] w-full rounded object-cover object-center"
                }
                src={post.image}
                alt={post.title}
              />
            </a>
          </PostLink>

          <div className="prose max-w-none">
            <p>{post.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
