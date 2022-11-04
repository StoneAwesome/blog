import * as React from "react";
import { Item } from "react-photoswipe-gallery";
import { useImageDimensions } from "@hooks/use-image";
import { IStoryBlokAssetMeta } from "@lib/storyblok-client";
import {
  getStoryBlokImageDimensions,
  transformStoryBlockImageUrl,
} from "@lib/storyblok-img-service";

export type StoryBlockImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {};

const StoryBlockImage: React.FC<StoryBlockImageProps> = (props) => {
  const src = props.src;
  const isStoryBlokImage = React.useMemo(
    () => src?.toLowerCase()?.startsWith("https://a.storyblok.com/"),
    [src]
  );

  return src && isStoryBlokImage ? (
    <StoryBlokImgWrapper src={src} alt={props.alt} title={props.title} />
  ) : (
    <DefaultImgWrapper {...props} />
  );
};

function getHWInRange(width: number, height: number, range: number = 1000) {
  if (width < range) {
    return {
      width,
      height,
    };
  }

  const multiplier = range / width;
  return {
    width: range,
    height: Math.floor(multiplier * height),
  };
}

function useStoryBlokImageDetails(src: string | undefined) {
  return React.useMemo(() => {
    if (!src) return null;
    const details = getStoryBlokImageDimensions(src);
    if (details) {
      const { width: thumbWidth, height: thumbHeight } = getHWInRange(
        details.width,
        details.height
      );
      const thumb = transformStoryBlockImageUrl(src, {
        width: thumbWidth,
        height: thumbHeight,
      });
      return {
        url: src,
        thumb: thumb,
        thumbHeight,
        thumbWidth,
        width: details.width,
        height: details.height,
      };
    }

    return {
      url: src,
      thumb: src,
      width: undefined,
      height: undefined,
      thumbHeight: undefined,
      thumbWidth: undefined,
    };
  }, [src]);
}

const StoryBlokImgWrapper: React.FC<{
  src: string;
  alt?: string;
  title?: string;
}> = (props) => {
  const i = useStoryBlokImageDetails(props.src);

  if (!i) return null;

  return <ItemWrapper {...i} alt={props.alt} title={props.title} />;
};

export const StoryBlokImg: React.FC<{
  img: IStoryBlokAssetMeta;
  className?: string;
}> = (props) => {
  const i = useStoryBlokImageDetails(props.img.filename);
  if (!i) return null;
  return (
    <ImageDetails
      {...i}
      className={props.className}
      title={props.img.title || undefined}
      alt={props.img.alt || undefined}
    />
  );
};

const DefaultImgWrapper: React.FC<StoryBlockImageProps> = (props) => {
  const { data: dim } = useImageDimensions(props.src);

  const i = React.useMemo(() => {
    if (!dim || !props.src) return null;

    const { width, height } = dim;
    const { width: thumbWidth, height: thumbHeight } = getHWInRange(
      width,
      height
    );

    return {
      url: props.src,
      thumb: props.src,
      thumbHeight,
      thumbWidth,
      width,
      height,
    };
  }, [dim]);

  if (!i) return null;

  return <ItemWrapper {...i} alt={props.alt} title={props.title} />;
};

interface ItemProps {
  url: string;
  alt?: string;
  title?: string;
  thumb: string;
  thumbHeight?: number;
  thumbWidth?: number;
  width?: number;
  height?: number;
}
const ItemWrapper: React.FC<ItemProps> = (i) => {
  return (
    <Item
      key={i.url}
      original={i.url}
      width={i.width}
      height={i.height}
      thumbnail={i.url}
      caption={i.title}
      cropped
    >
      {({ ref, open }) => (
        <figure ref={ref as any} data-mdr={true}>
          <ImageDetails
            {...i}
            onClick={open}
            className={
              "mx-auto max-h-[40vh] w-[90%] cursor-pointer rounded object-cover shadow transition-shadow duration-300 hover:shadow-lg hover:shadow-_bsInfo/50"
            }
          />

          {i.title && (
            <figcaption className="text-center">{i.title}</figcaption>
          )}
        </figure>
      )}
    </Item>
  );
};

const ImageDetails: React.FC<
  ItemProps & {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement> | undefined;
  }
> = (i) => (
  <img
    src={i.thumb}
    alt={i.alt}
    width={i.thumbWidth}
    height={i.thumbHeight}
    className={i.className}
    onClick={i.onClick}
  />
);

export default StoryBlockImage;
