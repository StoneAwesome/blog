import { GetStaticProps, GetStaticPaths } from "next";
import { MdxRemote } from "next-mdx-remote/types";
import { createMDXSource, fetchInstagramContent, grabInstagramMatterFromSource } from "../../lib/instagram";
import fs from "fs";
import { hydrateSource } from "../../lib/mdx-helper";
import InstagramLayout from "../../components/InstagramLayout";
import InstagramAPI, { InstagramMedia } from "../../lib/instagram-service";

export type Props = {
  title: string;
  dateString: string;
  instagram_id: string;
  tags: string[];
  post: InstagramMedia;
  source: MdxRemote.Source;
};

const slugToPostContent = ((instagramContents) => {
  let hash = {};
  instagramContents.forEach((it) => (hash[it.instagram_id] = it));
  return hash;
})(fetchInstagramContent());

export default function Instagram({ title, dateString, tags, source, instagram_id, post }: Props) {
  const content = hydrateSource(source);
  return (
    <InstagramLayout
      title={title}
      date={dateString}
      instagram_id={instagram_id}
      tags={tags}
      post={post}
      author={post.username}
    >
      {content}
    </InstagramLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchInstagramContent().map((it) => "/instagram/" + it.instagram_id);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const instagram_id = params.instagram_id as string;
  const source = fs.readFileSync(slugToPostContent[instagram_id].fullPath, "utf8");
  const { content, data } = grabInstagramMatterFromSource(source);

  const instagramService = new InstagramAPI();
  const post = await instagramService.getPost(data.instagram_id);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await createMDXSource(content, data);

  const props: Props = {
    title: data.title,
    instagram_id: data.instagram_id,
    dateString: data.date,
    tags: data.tags,
    source: mdxSource,
    post,
  };

  return {
    props,
  };
};
