import InstagramListPage from "@pages/instagram";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from "next";
import path from "path";
import { ParsedUrlQuery } from "querystring";
import { CollectionHelper, ICollectionBase, ICollectionSource, RTS } from "./collection-helper";
import InstagramAPI, { InstagramMedia } from "./instagram-service";

export interface InstagramContent extends ICollectionBase {
  material?: string[];
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  path.join(process.cwd(), "content/instagram")
);

export const fetchInstagramContent = () => instagramHelper.fetchCollectionContent();

export const createInstagramList = (ctx: GetStaticPropsContext<{ page: string }, PreviewData>) =>
  instagramHelper.createGetStaticPropsForPage(ctx);

const api = new InstagramAPI();
export const createInstagramItemPaths = (path: string) => {
  return async (ctx: GetStaticPathsContext): Promise<GetStaticPathsResult<ParsedUrlQuery>> => {
    const result = await instagramHelper.getStaticPathsForItems(path)(ctx);

    //-- Need to add any other routes

    const recent = await api.getRecentPosts();

    const setPath = new Set([...(result.paths as string[])]);
    recent.forEach((v) => setPath.add(`/${path}/${v.id}`));

    const paths: string[] = [];
    setPath.forEach((s) => paths.push(s));

    return {
      fallback: result.fallback,
      paths,
    };
  };
};

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
