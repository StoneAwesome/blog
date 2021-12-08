import DateView from "../basic/date-view";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import type { InstagramContent } from "@lib/instagram";
import useSWR from "swr";
import InstagramAPI from "@lib/instagram-service";


type Props = {
  post: Readonly<InstagramContent>;
};

const api = new InstagramAPI();
export default function PostItem({ post }: Props) {
  const url = `/instagram/${post.slug}`;
  const { data } = useSWR(`INSTAGRAM_MEDIA_${post.slug}`, () => api.getPost(post.slug));
  return (
    <div>
      <header className={"mt-5 mb-3"}>
        <Link href={url}>
          <a className={"text-decoration-none"}>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <DateView date={parseISO(post.date)} />
      </header>
      {data ? (
        <div>
          <Link href={url}>
            <a>
              <img
                className={"img-fluid rounded mb-3"}
                src={data.thumbnail_url || data.media_url}
                alt={post.title}
              />
            </a>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
