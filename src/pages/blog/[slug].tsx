import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  grabStory,
  IStoryBlockStory,
  IStoryBlokContent,
  IStoryBlokStoryResponse,
} from "@lib/storyblok-service";
import MarkdownRenderer from "@components/markdown-renderer";
import BasicContainer from "@components/basic/basic-container";
import { Gallery } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { parse, parseISO } from "date-fns";
import { GenericPostHeader } from "@components/post/post-header";

const BlogPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const {
    slug,
    story: {
      content: { title, date, keywords, description },
    },
  } = props;

  const publishDate = parse(date, "yyyy-MM-dd H:mm", new Date());

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
              <MarkdownRenderer markdown={props.story.content.body} />
            </Gallery>
          </div>
          {/* <div>
            <pre>
              <code>{JSON.stringify(props, null, 2)}</code>
            </pre>
          </div> */}
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

export const getServerSideProps: GetServerSideProps<{
  story: IStoryBlockStory<IBlogStory>;
  slug: string;
}> = async (ctx) => {
  const slug = ctx.params?.["slug"] as string;

  console.log("Here");

  if (!slug) {
    return {
      notFound: true,
    };
  }

  console.log("SLug", slug);
  const val = await grabStory<IBlogStory>(`cdn/stories/blog/${slug}`, true);

  if (!val?.story)
    return {
      notFound: true,
    };
  return {
    props: {
      story: val?.story,
      slug,
    },
  };
};

export default BlogPage;
