import * as React from "react";
import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import BasicContainer from "@components/basic/basic-container";
import { Gallery } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { parse } from "date-fns";
import renderToString from "next-mdx-remote/render-to-string";
import { hydrateSource, MDX_Components } from "@lib/mdx-helper";
import { MdxRemote } from "next-mdx-remote/types";
import StoryBlokClient, {
  IBlogStory,
} from "@lib/storyblok/storyblok-blog-client";
import type { IStoryBlockStory } from "@lib/storyblok/storyblok-client-base";
import Designer from "@components/post/post-designer";
import PostTags from "@components/post/post-tags";
import PostHeader from "@components/post/post-header";
import useStoryBlokLive, { IsInStoryBlok } from "@hooks/use-storyblok";
import { getOgImage } from "@lib/storyblok-img-service";

async function fetchMDX(value: string) {
  const res = await fetch("/api/hydrate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: value }),
  });
  const val = await res.json();
  return val.mdxSource;
}

const BlogPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { slug } = props;

  const story = useStoryBlokLive(props.story);

  const {
    content: { title, date, keywords, description, body, primary_image },
  } = story;

  const [mdx, set_mdx] = React.useState(props.mdx);

  const articleBodyNode = hydrateSource(mdx);

  React.useEffect(() => {
    if (IsInStoryBlok()) {
      try {
        fetchMDX(body).then(set_mdx);
      } catch {}
    }
  }, [body]);

  const publishDate = parse(date, "yyyy-MM-dd H:mm", new Date());

  const url = `/blog/${slug}`;

  return (
    <Layout>
      <BasicMeta
        url={url}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta url={url} title={title} description={description} />
      <OpenGraphMeta
        url={url}
        title={title}
        description={description}
        image={getOgImage(primary_image?.filename)}
      />
      <JsonLdMeta
        url={url}
        title={title}
        keywords={keywords}
        date={publishDate}
        description={description}
        image={getOgImage(primary_image?.filename)}
      />
      <BasicContainer>
        <article className="px-3">
          <PostHeader post={story} />
          <div className="prose max-w-none [&>p>figure>img]:mb-0 ">
            <Gallery withCaption withDownloadButton>
              {articleBodyNode}
              <div className="flex flex-col gap-3">
                <Designer designer={props.story.content.designer} />
                <PostTags post={props.story} />
              </div>
            </Gallery>
          </div>
        </article>
      </BasicContainer>
    </Layout>
  );
};

type PathQuery = {
  slug: string;
};
export const getStaticPaths: GetStaticPaths<PathQuery> = async (ctx) => {
  const links = await StoryBlokClient.grabStroyBlokBlogLinks();
  return {
    paths: links.map((l) => ({
      params: {
        slug: l.slug?.replace(/blog\//i, ""),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  {
    story: IStoryBlockStory<IBlogStory>;
    mdx: MdxRemote.Source;
    slug: string;
  },
  PathQuery
> = async (ctx) => {
  const slug = ctx.params?.slug;

  if (!slug) {
    return {
      notFound: true,
    };
  }
  const result = await StoryBlokClient.grabBlogStory(slug);

  if (!result?.story)
    return {
      notFound: true,
    };

  const mdx = await renderToString(result.story.content.body, MDX_Components);

  return {
    props: {
      story: result?.story,
      mdx,
      slug,
    },
  };
};

export default BlogPage;
