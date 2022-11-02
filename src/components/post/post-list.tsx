import React from "react";
import PostItem from "./post-item";
import Pagination from "@components/basic/pagination";
import BasicContainer from "@components/basic/basic-container";
import { IBlogStoryMeta } from "@lib/storyblok-client";

type Props = {
  posts: IBlogStoryMeta[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, pagination }: Props) {
  return (
    <BasicContainer>
      <div className={"my-5"}>
        <div className={"mb-5 flex flex-col"}>
          {posts.map((p) => (
            <PostItem post={p} key={p.id} />
          ))}
        </div>
        {pagination.pages > 0 && (
          <Pagination
            current={pagination.current}
            pages={pagination.pages}
            link={{
              href: (page) => (page === 1 ? "/blog" : "/blog/page/[page]"),
              as: (page) => (page === 1 ? "" : "/blog/page/" + page),
            }}
          />
        )}
      </div>
    </BasicContainer>
  );
}
