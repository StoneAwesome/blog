import React from "react";
import { PostContent } from "@lib/posts";
import { TagContent } from "@lib/tags";
import PostItem from "./post-item";
import Pagination from "../basic/pagination";
import Link from "next/link";
import BasicContainer from "@components/basic/basic-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-solid-svg-icons";
import { IBlogStoryMeta } from "@lib/storyblok-client";

type Props = {
  posts: IBlogStoryMeta[];
  tag: TagContent;
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
        <h1 className="font-thin">{tag.name}</h1>
      </div>
      <div>
        {posts.map((it, i) => (
          <div key={i}>
            <PostItem post={it} />
          </div>
        ))}
      </div>
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        link={{
          href: () => "/posts/tags/[[...slug]]",
          as: (page) =>
            page === 1
              ? "/posts/tags/" + tag.slug
              : `/posts/tags/${tag.slug}/${page}`,
        }}
      />
    </BasicContainer>
  );
}
