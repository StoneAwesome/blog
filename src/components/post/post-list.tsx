import React from "react";
import { PostContent } from "@lib/posts";
import PostItem from "./post-item";
import TagLink from "@components/post/tag-link";
import Pagination from "@components/basic/pagination";
import { TagContent } from "@lib/tags";
import BasicContainer from "@components/basic/basic-container";

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, tags, pagination }: Props) {
  return (
    <BasicContainer>
      <div className={"my-5"}>
        <div className={"mb-5"}>
          {posts.map((it, i) => (
            <div key={i}>
              <PostItem post={it} />
            </div>
          ))}
        </div>
        {pagination.pages > 0 && (
          <Pagination
            current={pagination.current}
            pages={pagination.pages}
            link={{
              href: (page) => (page === 1 ? "/posts" : "/posts/page/[page]"),
              as: (page) => (page === 1 ? "" : "/posts/page/" + page),
            }}
          />
        )}
      </div>
      {/* <div className={"flex flex-wrap gap-3 mt-3"}>
        {tags.map((it, i) => (
          <div key={i} className={"prose"}>
            <TagLink tag={it} />
          </div>
        ))}
      </div> */}
    </BasicContainer>
  );
}
