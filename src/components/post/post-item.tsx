import { StoryBlokImg } from "@components/storyblok/storyblok-image";
import { IBlogStoryMeta } from "@lib/storyblok-client";
import Link from "next/link";
import React from "react";
import PostHeader from "./post-header";

type Props = {
  post: Readonly<IBlogStoryMeta>;
  hideDescription?: boolean;
};
export default function PostItem({ post, hideDescription }: Props) {
  return (
    <div className="">
      <PostHeader post={post} />

      {post.content.primary_image.id && (
        <div className="">
          <Link href={`/blog/${post.slug}`}>
            <StoryBlokImg
              img={post.content.primary_image}
              className={
                "mx-auto mb-3 max-h-[40vh] w-[90%] rounded object-cover"
              }
            />
          </Link>
        </div>
      )}

      {post.content.description && !hideDescription ? (
        <div className="prose max-w-none">
          <p>{post.content.description}</p>
        </div>
      ) : null}
    </div>
  );
}
