import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import StoryBlokClient from "@lib/storyblok-client";
import {
  getStaticPathsForBlogPosts,
  getStaticPathsForBlogPostsByTag,
} from "@lib/posts";

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
    const story = await StoryBlokClient.grabStoryBlockByID(body.story_id);
    const slug = story?.story.full_slug;

    if (slug) {
      await revalidateBlogPages(slug, res);
    }
  }

  res.status(200).end();
};

/**
 * Revalidate the page for the slug, as well as all other paged blog pages.
 * @param slug Slug of the page to revalidate
 * @param res Next API response
 */
const revalidateBlogPages = async (slug: string, res: NextApiResponse) => {
  //-- If we have a valid slug we need to revalidate it
  console.log("Revalidating Story @ ", slug);
  //await res.revalidate(`/${slug}`);
  // //-- Revalidate main blog page
  // await res.revalidate(`/blog`);

  const pageProps = await getStaticPathsForBlogPosts();
  const blogPageSlugs = pageProps.map((p) => `/blog/${p.params.page}`);

  const tagPageProps = await getStaticPathsForBlogPostsByTag();
  const tagPageSlugs = tagPageProps.map(
    (p) => `/blog/${p.params.slug.join("/")}`
  );

  const allPagesToRevalidate = [
    slug, //-- Revalidate the page causing the revalidate
    "/blog", //-- Revalidate the main blog page
    ...blogPageSlugs, //-- Revalidate the dynamic pages for blog (as we might've just added or removed a story)
    ...tagPageSlugs, //-- Revalidate the dynamic pages for blog tags
  ].filter((x) => x);

  console.log("Revalidating the following pages:", allPagesToRevalidate);

  await Promise.all(allPagesToRevalidate.map((p) => res.revalidate(p)));

  console.log("Revalidated all pages");
};
