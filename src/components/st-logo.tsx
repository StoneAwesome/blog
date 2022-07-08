import * as React from "react";

const COMPANY_NAME = "StoneTrash";
const LOGO_DIMENSIONS = {
  horizontal: {
    height: 80,
    width: 227,
  },
  vertical: {
    width: 525,
    height: 519,
  },
  text: {
    width: 387,
    height: 120,
  },
  full: {
    width: 512,
    height: 748,
  },
};

type SharedProps = {
  className?: string;
  imgStyle?: React.CSSProperties;
};

type ORIENTATION = keyof typeof LOGO_DIMENSIONS;
export type LogoProps = SharedProps & {
  orientation: ORIENTATION;
  height?: number | string;
  width?: number | string;
};

type GlyphProps = SharedProps & {
  orientation: "glyph";
  size: "64" | "128" | "256" | "512" | "1024";
};

const STLogo: React.FC<LogoProps | GlyphProps> = (props) => {
  if (props.orientation === "glyph") {
    return (
      <picture>
        <source type="image/svg+xml" srcSet="/images/st/glyph.svg" />
        <img
          src={"/images/st/glyph.png"}
          alt={COMPANY_NAME}
          className={props.className}
          height={`${props.size}px`}
          width={`${props.size}px`}
          style={props.imgStyle}
        />
      </picture>
    );
  }

  const dimensions = LOGO_DIMENSIONS[props.orientation];

  return (
    <picture>
      <source
        type="image/svg+xml"
        srcSet={`/images/st/logo-${props.orientation}.svg`}
      />
      <img
        src={`/images/st/logo-${props.orientation}.png`}
        alt={COMPANY_NAME}
        className={props.className}
        height={props.height || dimensions.height}
        width={props.width || dimensions.width}
        style={props.imgStyle}
      />
    </picture>
  );
};

export default STLogo;
