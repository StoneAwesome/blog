import React from "react";
import Pagination from "../basic/pagination";
import BasicContainer from "@components/basic/basic-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-solid-svg-icons";
import { IBlogStoryMeta } from "@lib/storyblok/storyblok-blog-client";
import { IStoryBlockStory } from "@lib/storyblok/storyblok-client-base";

import PostList from "./post-list";

type Props = {
  posts: IStoryBlockStory<IBlogStoryMeta>[];
  tag: string;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function TagPostList({ posts, tag, pagination }: Props) {
  return (
    <BasicContainer>
      <div className="mt-3 flex items-center gap-3 text-2xl">
        <FontAwesomeIcon
          icon={faTag}
          className={"text-dark rounded bg-_bsInfo px-3 py-1 text-white"}
        />
        {":"}
        <h1 className="font-thin">{tag}</h1>
      </div>
      <PostList posts={posts} />

      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        link={{
          href: () => "/blog/tags/[[...slug]]",
          as: (page) =>
            page === 1 ? "/blog/tags/" + tag : `/blog/tags/${tag}/${page}`,
        }}
      />
    </BasicContainer>
  );
}
