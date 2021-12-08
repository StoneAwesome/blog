import DateView from "../basic/date-view";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import type { InstagramContent } from "@lib/instagram";
import useSWR from "swr";
import InstagramAPI from "@lib/instagram-service";
import { useIsLessThenMD, useIsMobile } from "@hooks/use-media";
import InstagramMaterialLink from "./instagram-material-link";

type Props = {
  post: Readonly<InstagramContent>;
};

const api = new InstagramAPI();
export default function PostItem({ post }: Props) {
  const url = `/instagram/${post.slug}`;
  const { data } = useSWR(`INSTAGRAM_MEDIA_${post.slug}`, () => api.getPost(post.slug));
  const size = useIsMobile();

  return (
    <div className={"d-flex flex-column text-center"}>
      <header>
        <Link href={url}>
          <a className={"text-decoration-none"}>
            <h1>{post.title}</h1>
          </a>
        </Link>
      </header>
      <small className={"d-flex align-items-center flex-column"}>
        <DateView date={parseISO(post.date)} />
      </small>
      {data ? (
        <div className={"mt-3 text-center"}>
          <Link href={url}>
            <a>
              <img
                className={`img-fluid rounded w-${size ? "50" : "75"}`}
                src={data.thumbnail_url || data.media_url}
                alt={post.title}
              />
            </a>
          </Link>
        </div>
      ) : null}
      {post.material && (
        <div className={"d-flex flex-wrap align-self-center mt-3 gap-3"}>
          {post.material.map((m) => (
            <InstagramMaterialLink material={m} key={m} />
          ))}
        </div>
      )}
    </div>
  );
}
