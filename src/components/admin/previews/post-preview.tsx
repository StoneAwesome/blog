import * as React from "react";
import { PostBody } from "@components/post/post-layout";
import type { PreviewTemplateComponentProps } from "netlify-cms-core";
import { parseISO } from "date-fns";
import { PostPageProps } from "@pages/posts/[slug]";
import { safeGet, useRemark } from "@components/admin/admin-helpers";

const Article: React.FC<PreviewTemplateComponentProps> = (props) => {
  const d = safeGet<PostPageProps>(props.entry);
  const md = useRemark(props.entry);

  return (
    <PostBody
      date={parseISO(d("date", "1900-01-01"))}
      slug={d("slug", "")}
      tags={d("tags", [])}
      title={d("title", "")}
      description={d("description", "")}
      author={d("author", "")}
    >
      {md}
    </PostBody>
  );
};

export default Article;
