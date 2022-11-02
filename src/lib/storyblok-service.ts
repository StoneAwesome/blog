import { getStoryblokApi } from "@storyblok/react";

export interface IStoryBlokContent {
  _uid: string;
}

export interface IStoryBlockStory<
  TContentType extends IStoryBlokContent = IStoryBlokContent
> {
  name: string;
  created_at: Date;
  published_at: Date;
  id: number;
  uuid: string;
  content: TContentType;
  slug: string;
  full_slug: string;
  sort_by_date: null;
  position: number;
  tag_list: any[];
  is_startpage: boolean;
  parent_id: number;
  meta_data: null;
  group_id: string;
  first_published_at: Date;
  release_id: null;
  lang: string;
  path: string;
  alternates: any[];
  default_full_slug: null;
  translated_slugs: null;
}

export interface IStoryBlokStoryResponse<
  TContentType extends IStoryBlokContent
> {
  story: IStoryBlockStory<TContentType>;
  cv: number;
  rels: IStoryBlockStory[];
  links: number[];
}

export interface IStoryBlockContentTitleDescription extends IStoryBlokContent {
  title: string;
  description: string;
}

async function grabStoryWithOptions<T extends IStoryBlokContent>(
  slug: string,
  options: {
    version: "draft" | "published";
    find_by?: "uuid";
    resolve_relations?: string[];
  }
): Promise<IStoryBlokStoryResponse<T> | null> {
  try {
    const result = await fetch(
      `https://api.storyblok.com/v2/${slug}?version=${options.version}&token=${
        process.env.NEXT_PUBLIC_STORYBLOK_READONLY_KEY
      }${options.find_by ? "&find_by=uuid" : ""}${
        options.resolve_relations
          ? `&resolve_relations=${options.resolve_relations.join(",")})}`
          : ""
      }`
    ).then((r) => {
      if (r.status !== 200) {
        return null;
      }
      return r.json();
    });

    if (!result) return null;

    const data = result;

    if (options.resolve_relations) {
      options.resolve_relations.map((r) => {
        const prop = r.split(".")[1];

        if (prop && data?.story?.content?.[prop]) {
          const id = data.story.content[prop];
          const storyForProp = data.rels?.find((r: any) => r.uuid === id);

          if (storyForProp) {
            data.story.content[prop] = JSON.parse(JSON.stringify(storyForProp));
          }
        }
      });
    }

    return data;
  } catch (e) {
    console.log(e);
  }

  return null;
}

export async function grabStory<T extends IStoryBlokContent>(
  slug: string,
  isDraft = false,
  resolveAdditionalProperties?: {
    storyItem: string;
    properties: StringKey<T>[];
  }
): Promise<IStoryBlokStoryResponse<T> | null> {
  return grabStoryWithOptions(slug, {
    version: isDraft ? "draft" : "published",
    resolve_relations: resolveAdditionalProperties
      ? resolveAdditionalProperties.properties.map(
          (p) => `${resolveAdditionalProperties.storyItem}.${p}`
        )
      : [],
  });
}

export async function grabStoryBlockByUUID<T extends IStoryBlokContent>(
  uuid: string,
  isDraft = false
) {
  return grabStoryWithOptions(`cdn/stories/${uuid}`, {
    version: isDraft ? "draft" : "published",
    find_by: "uuid",
  });
}

export async function grabStoryblokLinks(isDraft = false) {
  const storyblokApi = getStoryblokApi();
  let { data }: { data: IStoryBlokLinksResponse } = await storyblokApi.get(
    "cdn/links/",
    {
      version: isDraft ? "draft" : "published",
    }
  );
  return data;
}

export async function grabStoryblokMaterialLinks(isDraft = false) {
  const data = await grabStoryblokLinks(isDraft);

  const links = Object.keys(data.links)
    .map((l) => data.links[l])
    .filter(
      (l) => l.slug.match(/^material\//gi) && l.slug.split("/").length === 3
    )
    .map((l) => {
      const split = l.slug.split("/");

      return {
        link: l,
        material: split[2],
        species: split[1],
      };
    });

  return links;
}

interface IStoryBlokLinksResponse {
  links: { [key: string]: IStoryBlokLink };
}

export interface IStoryBlokLink {
  id: number;
  slug: string;
  name: string;
  is_folder: boolean;
  parent_id: number;
  published: boolean;
  path: null | string;
  position: number;
  uuid: string;
  is_startpage: boolean;
  real_path: string;
}
