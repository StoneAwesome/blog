export interface InstagramMedia {
  /**
   * The Media's caption text. Not returnable for Media in albums.
   */
  caption: string;

  /**
   * The Media's ID.
   */
  id: string;

  /**
   * The Media's type. Can be IMAGE, VIDEO, or CAROUSEL_ALBUM.
   */
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

  /**
   * The Media's URL.
   */
  media_url: string;

  /**
   * The Media's permanent URL. Will be omitted if the Media contains copyrighted material, or has been flagged for a copyright violation.
   */
  permalink: string;

  /**
   * The Media's thumbnail image URL. Only available on VIDEO Media.
   */
  thumbnail_url: string;

  /**
   * The Media's publish date in ISO 8601 format.
   */
  timestamp: string;

  /**
   * The Media owner's username.
   */
  username?: string;

  children?: Omit<InstagramMedia, "children">[];
}

const MEDIA_PROPERTIES: (keyof InstagramMedia)[] = [
  "caption",
  "id",
  "media_type",
  "media_url",
  "permalink",
  "thumbnail_url",
  "timestamp",
  "username",
];

interface IPageResult<T> {
  data: T[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

async function parsePagedResult<T>(url: string) {
  try {
    const response = await fetch(url);
    const details = (await response.json()) as IPageResult<T>;

    return details;
  } catch {}
  return null;
}

async function parsePagedResultDataOnly<T>(url: string) {
  const result = await parsePagedResult<T>(url);

  return result?.data || [];
}

class InstagramAPI {
  private static BASE_URI = "https://graph.instagram.com/";
  constructor(
    private userId: string = "7212714798742229",
    //-- Head to https://developers.facebook.com/apps/3182862881950108/instagram-basic-display/basic-display/ to get new key
    private access_token: string = process.env.INSTAGRAM_SECRET ||
      "IGQVJXdHdkMGJCS3h4WGg3bUxJMURveGJrYkFlVXRVYUJJeXVNQXVZAVm55WGdqSGJScWw1VkE1TVl1bkNiQUxhTGxtOUJwdk9PczY5bkJ5eGo3QUJjX092OFB3clRQbXRXZAzlRMl9LZAnRaeEcwbFNDegZDZD"
  ) {}

  async getRecentPosts(): Promise<InstagramMedia[]> {
    const url = this.buildUri("me/media", ...MEDIA_PROPERTIES);

    //-- In order to avoid rate-limits, lets just use debug data locally.
    if (process.env.NEXT_PUBLIC_IS_DEBUG) {
      const data = await import("../../data/recent-instagram.json");
      return data.data.map((d) => ({
        ...d,
        thumbnail_url: "",
        media_type: d.media_type as InstagramMedia["media_type"],
      }));
    }

    return await parsePagedResultDataOnly(url);
  }

  async getPost(id: string): Promise<InstagramMedia | null> {
    const url = this.buildUri(id, ...MEDIA_PROPERTIES);
    try {
      const result = await fetch(url);
      const details = (await result.json()) as InstagramMedia;

      if (details.media_type === "CAROUSEL_ALBUM") {
        //-- Lets grab media children
        details.children = await this.getChildren(id);
      }

      return details;
    } catch {}
    return null;
  }

  async getAllPosts(): Promise<InstagramMedia[]> {
    var url: string | null = this.buildUri("me/media", ...MEDIA_PROPERTIES);

    const results: InstagramMedia[] = [];
    do {
      const result: IPageResult<InstagramMedia> | null = await parsePagedResult<InstagramMedia>(
        url
      );

      if (result) {
        const data = result.data || [];

        if (data.length === 0) {
          url = null;
        } else {
          results.push(...data);
          url = result.paging.next;
        }
      } else {
        url = null;
      }
    } while (!!url);

    return results;
  }

  private async getChildren(id: string): Promise<InstagramMedia[]> {
    const url = this.buildUri(`${id}/children`, ...MEDIA_PROPERTIES.filter((p) => p !== "caption"));
    return await parsePagedResultDataOnly<InstagramMedia>(url);
  }

  //   private buildUri<T extends keyof InstagramEndpoints>(
  //     endpoint: T,
  //     ...fields: (keyof InstagramEndpoints[T])[]
  //   ) {
  //     return `${InstagramAPI.BASE_URI}${endpoint}?fields=${fields.join(",")}&access_token=${
  //       this.access_token
  //     }`;
  //   }

  private buildUri(
    endpoint: "me/media" | InstagramChildrenEndpoint | string,
    ...fields: (keyof InstagramMedia)[]
  ) {
    return `${InstagramAPI.BASE_URI}${endpoint}?fields=${fields.join(",")}&access_token=${
      this.access_token
    }`;
  }
}

type InstagramChildrenEndpoint = `${string}/children`;
type InstagramEndpoints = {
  "me/media": InstagramMedia;
  [x: InstagramChildrenEndpoint]: InstagramMedia;
};

export default InstagramAPI;
