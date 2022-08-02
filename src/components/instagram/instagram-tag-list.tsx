import React from "react";
import { TagContent } from "@lib/tags";
import Pagination from "../basic/pagination";
import BasicContainer from "@components/basic/basic-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-solid-svg-icons";
import { InstagramContent } from "@lib/instagram";
import InstagramItem from "./instagram-item";

type Props = {
  posts: InstagramContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function InstagramTagList({ posts, tag, pagination }: Props) {
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
      <div className={"my-2"}>
        <div className={`grid grid-cols-3 gap-3 lg:grid-cols-4`}>
          {posts.map((it, i) => (
            <InstagramItem key={i} post={it} />
          ))}
        </div>
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