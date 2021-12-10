import { InstagramBody } from "@components/instagram/instagram-layout";
import { InstagramPageProps } from "@pages/instagram/[slug]";
import { safeGet, useRemark } from "../admin-helpers";
import type { PreviewTemplateComponentProps } from "netlify-cms-core";

const InstagramPreview: React.FC<PreviewTemplateComponentProps> = (props) => {
  const d = safeGet<InstagramPageProps>(props.entry);
  const md = useRemark(props.entry);

  return (
    <InstagramBody
      date={d("date", "1900-01-01")}
      post={d("post", {
        id: "-1",
        images: [],
        caption: "",
        mediaType: "IMAGE",
        timestamp: "1900-01-01",
        permalink: "https://",
        primaryMedia: {
          height: 0,
          id: "",
          width: 0,
          url: "",
        },
      })}
      slug={d("slug", "-")}
      title={d("title", "-")}
      material={[...(d("material", []) || [])]}
      tags={d("tags", [])?.map((x) => x)}
    >
      {md}
    </InstagramBody>
  );
};

export default InstagramPreview;
