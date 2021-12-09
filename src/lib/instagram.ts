import { GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next";
import path from "path";
import { ParsedUrlQuery } from "querystring";
import { CollectionHelper, ICollectionBase, ICollectionSource, RTS } from "./collection-helper";
import InstagramAPI, { InstagramMedia } from "./instagram-service";

const api = new InstagramAPI();

export interface InstagramContent extends ICollectionBase {
  material?: string[];
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  path.join(process.cwd(), "content/instagram"),
  async (items, gfp) => {
    const posts = await api.getRecentPosts();
    return posts.map((p) => {
      const mdx = items.find((i) => i.slug === p.id);
      return {
        date: p.timestamp,
        fullPath: gfp(p.id),
        slug: p.id,
        title: mdx?.title || "Instagram Post",
        material: mdx?.material || [],
        tags: mdx?.tags || [],
      };
    });
  }
);

export const fetchInstagramContent = () => instagramHelper.fetchCollectionContent();

export const createInstagramList = (ctx: GetStaticPropsContext<{ page: string }, PreviewData>) =>
  instagramHelper.createGetStaticPropsForPage(ctx);

export const createInstagramItemPaths = (path: string) =>
  instagramHelper.getStaticPathsForItems(path, async () => {
    const recent = await api.getRecentPosts();
    return recent.map((v) => `/${path}/${v.id}`);
  });

export const createInstagramPathsForPages = () => instagramHelper.getStaticPathsForPages();

type InstagramItemProps = ICollectionSource<InstagramContent & { post: InstagramMedia | null }>;
export const getInstagramItemProps =
  (rts: RTS) =>
  async (
    ctx: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
  ): Promise<GetStaticPropsResult<InstagramItemProps>> => {
    const r = await instagramHelper.getEnhancedStaticPropsForItem(rts, async (i) => {
      const post = await api.getPost(i.slug);
      return {
        ...i,
        post,
      };
    })(ctx);

    const anyR = r as any;
    if (anyR.props) {
      return anyR;
    }

    if (anyR.notFound) {
      //-- try to find via APi
      const media = await api.getPost(ctx.params?.slug as string);
      if (media) {
        return {
          props: {
            date: media.timestamp,
            fullPath: "ee",
            post: media,
            slug: media.id,
            source: null as any,
            title: "Instagram Post",
          },
        } as { props: InstagramItemProps };
      }
    }

    return r;
  };
