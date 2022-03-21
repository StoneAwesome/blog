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
        <div className={"my-2"}>
          <div className={"d-flex flex-wrap"}>
            {posts.map((it, i) => (
              <div key={i} className="col-4 p-lg-2" style={{ padding: "0.5px" }}>
                <InstagramItem post={it} />
              </div>
            ))}
          </div>
        </div>
        {pagination.pages > 0 && (
          <Pagination
            current={pagination.current}
            pages={pagination.pages}
            link={{
              href: (page) => (page === 1 ? "/instagram" : "/instagram/page/[page]"),
              as: (page) => (page === 1 ? "" : "/instagram/page/" + page),
            }}
          />
        )}
      </div>
    </div>
  );
}
