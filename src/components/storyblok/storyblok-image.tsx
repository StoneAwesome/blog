import * as React from "react";
import NextImage from "next/image";
import { Item } from "react-photoswipe-gallery";
import { useImageDimensions } from "@hooks/use-image";

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
    <StoryBlokImgWrapper src={src} />
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

const StoryBlokImgWrapper: React.FC<{ src: string }> = (props) => {
  const i = React.useMemo(() => {
    const match = /\/(\d+)x(\d+)\//gm.exec(props.src);

    if (match) {
      const width = parseInt(match[1]);
      const height = parseInt(match[2]);
      const { width: thumbWidth, height: thumbHeight } = getHWInRange(
        width,
        height
      );
      const thumb = `${props.src}/m/${thumbWidth}x${thumbHeight}`;
      return {
        url: props.src,
        thumb: thumb,
        thumbHeight,
        thumbWidth,
        width,
        height,
      };
    }
    return {
      url: props.src,
      thumb: props.src,
      width: undefined,
      height: undefined,
      thumbHeight: undefined,
      thumbWidth: undefined,
    };
  }, [props]);

  return <ItemWrapper {...i} />;
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

  return <ItemWrapper {...i} />;
};

interface ItemProps {
  url: string;
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
      cropped
    >
      {({ ref, open }) => (
        <img
          src={i.thumb}
          alt={"Image for Blog Post"}
          width={i.thumbWidth}
          height={i.thumbHeight}
          placeholder={"blur"}
          ref={ref as any}
          className={
            "mx-auto max-h-[40vh] w-[90%] cursor-pointer rounded object-cover shadow transition-shadow duration-300 hover:shadow-lg hover:shadow-_bsInfo/50"
          }
          onClick={open}
        />
      )}
    </Item>
  );
};

export default StoryBlockImage;
