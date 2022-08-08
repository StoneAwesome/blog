import React from "react";
import InstagramItem from "./instagram-item";
import Pagination from "@components/basic/pagination";
import type { TagContent } from "@lib/tags";
import type { InstagramContent } from "@lib/instagram";
import BasicContainer from "@components/basic/basic-container";
//import { useMasonryLayout } from "@hooks/use-masonry-layout";

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
    <BasicContainer>
      <div className={"my-2"}>
        <div className={`grid grid-cols-3 gap-3`}>
          {posts.map((it, i) => (
            <InstagramItem key={i} post={it} />
          ))}
        </div>
      </div>
      {pagination.pages > 0 && (
        <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) =>
              page === 1 ? "/instagram" : "/instagram/page/[page]",
            as: (page) => (page === 1 ? "" : "/instagram/page/" + page),
          }}
        />
      )}
    </BasicContainer>
  );
}
