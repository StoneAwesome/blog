import React from "react";
import { Item } from "react-photoswipe-gallery";

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
const IMG_CLASS_NAME =
  "mx-auto max-h-[40vh] w-[90%] cursor-pointer rounded object-cover shadow transition-shadow duration-300 hover:shadow-lg hover:shadow-_bsInfo/50";

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
        <img
          ref={ref as any}
          src={i.thumb}
          alt={i.alt}
          width={i.thumbWidth}
          height={i.thumbHeight}
          className={IMG_CLASS_NAME}
          title={i.title}
          onClick={open}
        />
      )}
    </Item>
  );
};

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

const MDXImage: React.FC<ImgProps> = (props) => {
  const imgInfo = React.useMemo<
    (ItemProps & { hasKnownDimensions?: boolean }) | null
  >(() => {
    if (!props.src) return null;
    const match = /\/(\d+)x(\d+)\//gm.exec(props.src || "");

    if (match && props.src) {
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
        title: props.title,
        width,
        height,
        hasKnownDimensions: true,
      } as ItemProps;
    }
    return {
      url: props.src,
      thumb: props.src,
      width: undefined,
      height: undefined,
      thumbHeight: undefined,
      thumbWidth: undefined,
    };
  }, [props.src]);

  if (!imgInfo) return null;

  if (imgInfo.hasKnownDimensions) {
    return <ItemWrapper {...imgInfo} />;
  }

  return <NonCDNImg {...props} />;
};

const NonCDNImg: React.FC<ImgProps> = (props) => {
  const [dimensions, set_dimensions] = React.useState<{
    height: number;
    width: number;
  }>();

  if (!props.src) return null;

  if (dimensions) {
    return (
      <ItemWrapper
        url={props.src}
        thumb={props.src}
        height={dimensions.height}
        width={dimensions.width}
        alt={props.alt}
        title={props.title}
      />
    );
  }

  return (
    <img
      {...props}
      onLoad={(i) => {
        set_dimensions({
          height: i.currentTarget.naturalHeight,
          width: i.currentTarget.naturalWidth,
        });
      }}
      className={IMG_CLASS_NAME}
    />
  );
};

export default MDXImage;
