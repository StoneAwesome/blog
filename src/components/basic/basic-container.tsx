import * as React from "react";

export type BasicContainerProps = {
  noMB?: boolean;
};

const BasicContainer: React.FC<React.PropsWithChildren<BasicContainerProps>> = (
  props
) => {
  return (
    <div
      className={`mx-auto ${
        props.noMB ? "" : "mb-5"
      } max-w-[820px] px-2 md:px-3 lg:max-w-[992px]`}
    >
      {props.children}
    </div>
  );
};

export default BasicContainer;
