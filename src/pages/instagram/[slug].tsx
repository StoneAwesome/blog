import { createInstagramItemPaths, getInstagramItemProps } from "../../lib/instagram";
import { hydrateSource } from "../../lib/mdx-helper";
import InstagramLayout from "../../components/InstagramLayout";
import { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";

export default function Instagram({
  title,
  tags,
  source,
  slug,
  date,
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const content = hydrateSource(source);
  return (
    <InstagramLayout title={title} date={date} tags={tags} post={post} slug={slug}>
      {content}
    </InstagramLayout>
  );
}

export const getStaticPaths = createInstagramItemPaths("instagram");

export const getStaticProps = getInstagramItemProps(renderToString);
