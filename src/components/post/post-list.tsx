import React from "react";
import PostItem from "./post-item";
import { IBlogStoryMeta } from "@lib/storyblok/storyblok-blog-client";
import { IStoryBlockStory } from "@lib/storyblok/storyblok-client-base";

type Props = {
  posts: IStoryBlockStory<IBlogStoryMeta>[];
};
export default function PostList({ posts }: Props) {
  return (
    <div className={"mx-auto mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
      {posts.map((p) => (
        <PostItem post={p} key={p.id} />
      ))}
    </div>
  );
}
