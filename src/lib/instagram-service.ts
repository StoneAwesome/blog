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

async function parsePagedResult<T>(url: string) {
  try {
    const result = await fetch(url);
    const details = (await result.json()) as {
      data: T[];
      paging: {
        cursors: {
          before: string;
          after: string;
        };
        next: string;
      };
    };

    return details.data || [];
  } catch {}
  return [];
}

class InstagramAPI {
  private static BASE_URI = "https://graph.instagram.com/";
  constructor(
    private userId: string = "7212714798742229",
    private access_token: string = "IGQVJYalZAWVGFUb0ZAFLWVVdGVjb1ZArYmxob01VV2dtbGc0QTlEVWpKbTREeTFhUkpWYWU0NzNJSllSLS16NU1PR211THpBTDhpY3psMkVlb19kVE9hNkdLemdNQ2NjeHlSYm9lWkNsRTFicFhfU1NEbAZDZD"
  ) {}

  async getRecentPosts(): Promise<InstagramMedia[]> {
    const url = this.buildUri("me/media", ...MEDIA_PROPERTIES);

    return await parsePagedResult(url);
  }

  async getAlbumImages(id: string): Promise<InstagramMedia[]> {
    const url = this.buildUri(`${id}/children`, ...MEDIA_PROPERTIES);
    return await parsePagedResult(url);
  }

  async getPost(id: string): Promise<InstagramMedia> {
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

  private async getChildren(id: string): Promise<InstagramMedia[]> {
    const url = this.buildUri(`${id}/children`, ...MEDIA_PROPERTIES.filter((p) => p !== "caption"));
    console.log("Kid URL", url);
    return await parsePagedResult(url);
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
