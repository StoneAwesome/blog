import * as React from "react";
import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import {
  grabStory,
  grabStroyBlokBlogLinks,
  IStoryBlockStory,
  IStoryBlokContent,
} from "@lib/storyblok-service";
import BasicContainer from "@components/basic/basic-container";
import { Gallery } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { parse } from "date-fns";
import { GenericPostHeader } from "@components/post/post-header";
import renderToString from "next-mdx-remote/render-to-string";
import { hydrateSource, MDX_Components } from "@lib/mdx-helper";
import { MdxRemote } from "next-mdx-remote/types";

const BlogPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const {
    slug,
    story: {
      content: { title, date, keywords, description },
    },
  } = props;

  const publishDate = parse(date, "yyyy-MM-dd H:mm", new Date());

  const content = hydrateSource(props.mdx);
  return (
    <Layout>
      <BasicMeta
        url={`/blog/${props.slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
      <JsonLdMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        date={publishDate}
        description={description}
      />
      <BasicContainer>
        <article>
          <GenericPostHeader
            url={`/blog/${slug}`}
            title={title}
            date={publishDate}
          />

          <div className="prose max-w-none [&>p>figure>img]:mb-0">
            <Gallery withCaption withDownloadButton>
              {content}
            </Gallery>
          </div>
          <div>
            <pre>
              <code>{JSON.stringify(props, null, 2)}</code>
            </pre>
          </div>
        </article>
      </BasicContainer>
    </Layout>
  );
};

type IBlogStory = IStoryBlokContent & {
  title: string;
  subtitle: string;
  /**
   * This is markdown
   */
  body: string;
  date: string;
  description?: string;
  keywords?: string[];
};

type PathQuery = {
  slug: string;
};
export const getStaticPaths: GetStaticPaths<PathQuery> = async (ctx) => {
  const links = await grabStroyBlokBlogLinks(true);
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
  const result = await grabStory<IBlogStory>(`cdn/stories/blog/${slug}`, true);

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
