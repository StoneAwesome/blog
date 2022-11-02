import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import StoryBlokClient from "@lib/storyblok-client";

function verifySignature(body: any, signature: string | string[] | undefined) {
  let bodyHmac = crypto
    .createHmac("sha1", process.env.STORYBLOK_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  return bodyHmac === signature;
}

interface IBodyType {
  text: string;
  action: "published" | "unpublished";
  space_id: number;
  story_id: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IBodyType;

  if (verifySignature(body, req.headers["webhook-signature"])) {
    const story = await StoryBlokClient.grabStoryBlockByID(body.story_id, true);
    const slug = story?.story.full_slug;
    if (slug) {
      console.log("Revalidating Story @ ", slug);
      await res.revalidate(`/${slug}`);
    }
  }
  res.status(200).end();
};
