import { buildUrl, setConfig } from "cloudinary-build-url";

const CLOUDINARY_PREFIX =
  "https://res.cloudinary.com/stoneawesome/image/upload";
setConfig({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
});

export function isCloudinaryUrl(imageUrl: string) {
  return imageUrl.indexOf(CLOUDINARY_PREFIX) === 0;
}

export function createCloudinaryRelativeUrl(imageUrl: string) {
  return imageUrl.replace(CLOUDINARY_PREFIX, "");
}

export function buildInstagramThumbnailBlurImage(
  imageId: string,
  sizeInPixels: number
) {
  return buildUrl(imageId, {
    transformations: {
      resize: {
        width: sizeInPixels,
        height: sizeInPixels,
        type: "fill",
      },
      effect: {
        name: "blur",
        value: "400",
      },
    },
  });
}

export function buildSquareThumbnailImage(
  imageId: string,
  sideInPixels: number
) {
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

export async function getImageDimensionsFromImageUrl(
  imgUrl: string
): Promise<{ height: number; width: number }> {
  if (typeof window === undefined) {
    return { height: 0, width: 0 };
  }

  var prom = new Promise<{ width: number; height: number }>((r) => {
    var img = new Image();

    img.addEventListener("load", function () {
      r({
        height: this.naturalHeight,
        width: this.naturalWidth,
      });
    });
    img.addEventListener("error", function () {
      r({ height: 0, width: 0 });
    });
    img.src = imgUrl;
  });

  const r = await prom;

  return r;
}

export async function urlToDataUrl(url: string) {
  const resp = await fetch(url);

  const blob = await resp.blob();
  const dataUrl = await blobToDataURL(blob);

  return dataUrl;
}

export function blobToDataURL(blob: Blob) {
  var promise = new Promise<string>((resolve) => {
    var a = new FileReader();
    a.onload = function (e) {
      resolve(e.target?.result as string);
    };
    a.readAsDataURL(blob);
  });

  return promise;
}
