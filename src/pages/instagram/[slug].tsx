import { fetchInstagramContent, getInstagramItemProps } from "../../lib/instagram";
import { hydrateSource } from "../../lib/mdx-helper";
import InstagramLayout from "../../components/InstagramLayout";
import { InferGetStaticPropsType } from "next";

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

export const getStaticPaths = async () => {
  const paths = fetchInstagramContent().map((it) => "/instagram/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = getInstagramItemProps();
