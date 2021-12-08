import React from "react";
import InstagramItem from "./instagram-item";
import Pagination from "@components/basic/pagination";
import type { TagContent } from "@lib/tags";
import type { InstagramContent } from "@lib/instagram";

type Props = {
  posts: InstagramContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function InstagramList({ posts, tags, pagination }: Props) {
  return (
    <div className={"container"}>
      <div className={"posts-container"}>
        <div className={"my-5"}>
          <div className={"mb-5"}>
            {posts.map((it, i) => (
              <div key={i}>
                <InstagramItem post={it} />
              </div>
            ))}
          </div>
          {pagination.pages > 0 && (
            <Pagination
              current={pagination.current}
              pages={pagination.pages}
              link={{
                href: (page) => (page === 1 ? "/instagram" : "/instagram/page/[page]"),
                as: (page) => (page === 1 ? null : "/instagram/page/" + page),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
