import { CollectionHelper } from "./collection-helper";
import StoryBlokClient from "./storyblok-client";

export const BLOG_POST_PAGE_SIZE = 1;

export const getStaticPathsForBlogPosts = async () => {
  const totalPosts = await StoryBlokClient.grabStoryBlokBlogPageCount();
  const props = CollectionHelper.GetPagePathsFromTotal(
    totalPosts,
    BLOG_POST_PAGE_SIZE
  );
  return props.paths;
};

export const getStaticPathsForBlogPostsByTag = async () => {
  const allTags = await StoryBlokClient.getTags();

  const result =
    allTags?.tags
      ?.map((t) => {
        const pages = CollectionHelper.GetPagePathsFromTotal(
          t.taggings_count,
          BLOG_POST_PAGE_SIZE
        );
        return [
          ...pages.paths.map((p) => ({
            params: {
              slug: [t.name, p.params.page],
            },
          })),
          {
            params: {
              slug: [t.name],
            },
          },
        ];
      })
      .flatMap((p) => p) || [];

  return result;
};
