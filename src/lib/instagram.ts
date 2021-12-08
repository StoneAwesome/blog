import { GetStaticPathsContext, GetStaticPropsContext, PreviewData } from "next";
import path from "path";
import { CollectionHelper, ICollectionBase } from "./collection-helper";
import InstagramAPI from "./instagram-service";

export interface InstagramContent extends ICollectionBase {
  title: string;
  fullPath: string;
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  path.join(process.cwd(), "content/instagram")
);

export const fetchInstagramContent = () => instagramHelper.fetchCollectionContent();

export const countInstagramPosts = (tag?: string) => instagramHelper.countPosts(tag);

export const createInstagramList = (ctx: GetStaticPropsContext<{ page: string }, PreviewData>) =>
  instagramHelper.createGetStaticPropsForPage(ctx);

export const createInstagramItemPaths = (path: string) => instagramHelper.getStaticPathsForItems(path);

export const getInstagramItemProps = () =>
  instagramHelper.getEnhancedStaticPropsForItem(async (i) => {
    const instagramService = new InstagramAPI();
    const post = await instagramService.getPost(i.slug);
    return {
      ...i,
      post,
    };
  });
