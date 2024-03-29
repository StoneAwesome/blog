import React from "react";
import { isMaterialTag, TagContent } from "@lib/tags";
import Pagination from "../basic/pagination";
import BasicContainer from "@components/basic/basic-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-solid-svg-icons";
import { InstagramContent } from "@lib/instagram";
import InstagramItem from "./instagram-item";
import Link from "next/dist/client/link";
import ShopThisLookButton from "@components/shop-this-look-button";

type Props = {
  posts: InstagramContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function InstagramTagList({ posts, tag, pagination }: Props) {
  const isMaterial = isMaterialTag(tag);
  return (
    <BasicContainer>
      <div className="mt-3 flex items-center justify-between">
        <div className=" flex items-center gap-3 text-2xl">
          <Link href="/instagram/tags">
            <FontAwesomeIcon
              icon={faTag}
              className={"text-dark rounded bg-_bsInfo px-3 py-1 text-white"}
            />
          </Link>
          {":"}
          <h1 className="font-thin">{tag.name}</h1>
        </div>
        {isMaterial ? (
          <ShopThisLookButton
            links={[
              {
                title: "Search on StoneTrash",
                url: `https://stonetrash.com/search?format=slab&query=${tag.name}`,
                isSt: true,
              },
            ]}
            utmProps={{
              utm_source: "StoneAwesome",
              utm_medium: "web",
              utm_term: tag.slug,
            }}
          />
        ) : null}
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
          href: () => "/instagram/tags/[[...slug]]",
          as: (page) =>
            page === 1
              ? "/instagram/tags/" + tag.slug
              : `/instagram/tags/${tag.slug}/${page}`,
        }}
      />
    </BasicContainer>
  );
}
