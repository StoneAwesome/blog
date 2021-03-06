import { buildUrl, setConfig } from "cloudinary-build-url";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/stoneawesome/image/upload";
setConfig({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
});

export function isCloudinaryUrl(imageUrl: string) {
  return imageUrl.indexOf(CLOUDINARY_PREFIX) === 0;
}

export function createCloudinaryRelativeUrl(imageUrl: string) {
  return imageUrl.replace(CLOUDINARY_PREFIX, "");
}

export function buildInstagramThumbnailBlurImage(imageId: string, sizeInPixels: number) {
  return buildUrl(imageId, {
    transformations: {
      resize: {
        width: sizeInPixels,
        height: sizeInPixels,
        type: "fill"
      },
      effect: {
        name: "blur",
        value: "400",
      },
    },
  });
}

export function buildSquareThumbnailImage(imageId: string, sideInPixels: number) {
  return buildUrl(imageId, {
    transformations: {
      resize: {
        type: "fill",
        width: sideInPixels,
        height: sideInPixels,
      },
    },
  });
}

export function createTwitterGraphImage(imageId: string) {
  return buildUrl(imageId, {
    transformations: {
      resize: {
        aspectRatio: "2",
        type: "crop",
      },
    },
  });
}

export function createFacebookOGGraphImage(imageId: string) {
  //1200 x 630
  return buildUrl(imageId, {
    transformations: {
      resize: {
        width: 1260,
        height: 630,
        type: "fill",
      },
    },
  });
}
