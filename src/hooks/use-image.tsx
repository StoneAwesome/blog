import { createCacheFetcher } from "@lib/cache_king";
import {
  getImageDimensionsFromImageUrl,
  urlToDataUrl,
} from "@lib/image-service";

import useSWR from "swr";

type LoadedState = "Loading" | "Loaded" | "Failed";

type ImageState = {
  image?: HTMLImageElement;
  status: LoadedState;
  url: string;
};

async function fetchImage(url: string) {
  const img = document.createElement("img");

  var prom = new Promise<ImageState>(async (resolve, reject) => {
    function onload() {
      resolve({
        status: "Loaded",
        url: url,
        image: img,
      });
    }

    function onerror() {
      reject({ image: undefined, status: "Failed", url });
    }

    img.addEventListener("load", onload);
    img.addEventListener("error", onerror);
  });

  //-- Konva has an issue rendering images that are on another domain, so we create a data url
  // to make sure we have no issues exporting this canvas as an image
  /// See: https://konvajs.org/docs/data_and_serialization/Stage_Data_URL.html
  urlToDataUrl(url).then((actUrl) => {
    img.src = actUrl as string;
  });
  return prom;
}

const imageCache = createCacheFetcher<ImageState>(
  200,
  (i) => i.url,
  async (urls) => {
    if (!urls || urls.length === 0) {
      return [];
    }

    const images = urls.filter((u) => u).map((u) => fetchImage(u));

    return Promise.all(images);
  }
);

export default function useImage(
  url: string,
  key?: string
): [undefined | HTMLImageElement, LoadedState] {
  const { data: image } = useSWR(
    `USE_IMAGE_${key || url}`,
    () => imageCache.getItem(url),
    {
      fallbackData: {
        status: "Loading",
        url: url,
      },
    }
  );

  return [image?.image, image?.status || "Failed"];
}

export function useImageDimensions(url: string | undefined) {
  return useSWR(`USE_IMG_DIM_${url}`, async () => {
    if (!url) {
      return null;
    }
    const dim = await getImageDimensionsFromImageUrl(url);
    return dim;
  });
}

//var defaultState: ImageState = { image: undefined, status: "Loading", url: "" };
// export default function useImage(
//   url: string,
//   crossOrigin?: string
// ): [undefined | HTMLImageElement, LoadedState] {
//   var res = React.useState(defaultState);
//   var image = res[0].image;
//   var status = res[0].status;

//   var setState = res[1];

//   React.useEffect(
//     function() {
//       if (!url) return;
//       const img = document.createElement("img");

//       function onload() {
//         setState({ image: img, status: "Loaded", url });
//       }

//       function onerror() {
//         setState({ image: undefined, status: "Failed", url });
//       }

//       img.addEventListener("load", onload);
//       img.addEventListener("error", onerror);
//       crossOrigin && (img.crossOrigin = crossOrigin);

//       //-- Konva has an issue rendering images that are on another domain, so we create a data url
//       // to make sure we have no issues exporting this canvas as an image
//       /// See: https://konvajs.org/docs/data_and_serialization/Stage_Data_URL.html
//       urlToDataurl(url).then(actUrl => {
//         img.src = actUrl as string;
//       });

//       return function cleanup() {
//         img.removeEventListener("load", onload);
//         img.removeEventListener("error", onerror);
//         setState(defaultState);
//       };
//     },
//     [url, crossOrigin]
//   );

//   // return array because it it better to use in case of several useImage hooks
//   // const [background, backgroundStatus] = useImage(url1);
//   // const [patter] = useImage(url2);

//   return [image, status];
// }
