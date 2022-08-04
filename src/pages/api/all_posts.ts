import {
  fetchInstagramContent,
  InstagramContent,
  StoredInstagramImage,
} from "@lib/instagram";
import type { NextApiRequest, NextApiResponse } from "next";

export type AllInstagramResponse = Pick<
  InstagramContent,
  "colors" | "material" | "tags" | "title"
> & {
  slug: string;
  caption?: string;
  primaryImageUrl?: StoredInstagramImage;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<AllInstagramResponse[]>
) => {
  try {
    const content = await fetchInstagramContent();

    const result: AllInstagramResponse[] = content.map((c) => {
      return {
        colors: c.colors,
        slug: c.slug,
        tags: c.tags,
        material: c.material,
        title: c.title,
        caption: c.post.caption,
        primaryImageUrl: c.post?.primaryMedia,
      };
    });

    res.status(200).json(result);
  } catch (er) {
    res.status(500).end();
  }
};
