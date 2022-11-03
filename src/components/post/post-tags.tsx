import { faTags } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IBlogStoryMeta } from "@lib/storyblok-client";
import Link from "next/link";
import * as React from "react";

export type PostTagsProps = {
  post: IBlogStoryMeta;
};

const PostTags: React.FC<PostTagsProps> = (props) => {
  if (!props.post.tag_list || props.post.tag_list.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-4">
      <FontAwesomeIcon
        icon={faTags}
        className={"text-dark rounded bg-_bsInfo px-3 py-1 text-white"}
      />
      {props.post.tag_list.map((t) => (
        <Link href={`/blog/tags/${t}`} key={t}>
          {"#" + t}
        </Link>
      ))}
    </div>
  );
};

export default PostTags;
