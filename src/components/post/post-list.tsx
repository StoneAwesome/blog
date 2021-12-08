import React from "react";
import { PostContent } from "@lib/posts";
import PostItem from "./post-item";
import TagLink from "@components/post/tag-link";
import Pagination from "@components/basic/pagination";
import { TagContent } from "@lib/tags";

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
    <div className={"container"}>
      <div className={"posts-container"}>
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
        <div className={"d-flex flex-wrap mt-3"}>
          {tags.map((it, i) => (
            <div key={i} className={"my-1 mx-2"}>
              <TagLink tag={it} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
