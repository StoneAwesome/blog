import { IStoryBlokAssetMeta } from "./storyblok-client";

export function getStoryBlokImageDimensions(src: string) {
  if (!src) return null;
  const match = /\/(\d+)x(\d+)\//gm.exec(src);

  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);
    return {
      height,
      width,
    };
  }
}

interface TransformOptions {
  height?: number;
  width?: number;
}

export function transformStoryBlokImage(
  img: IStoryBlokAssetMeta,
  options: TransformOptions
) {
  const url = img?.filename;
  if (!url) return null;
  return transformStoryBlockImageUrl(url, options);
}

export function transformStoryBlockImageUrl(
  url: string,
  options: TransformOptions
) {
  return `${url}/m/${options.width || 0}x${options.height || 0}`;
}

export function getOgImage(
  img: IStoryBlokAssetMeta | string,
  fallbackValue: string = ""
) {
  const url = typeof img === "string" ? img : img?.filename;

  if (url) {
    return transformStoryBlockImageUrl(url, { width: 1200, height: 627 });
  }

  return fallbackValue;
}
