import * as React from "react";

export type BasicContainerProps = {};

const BasicContainer: React.FC<React.PropsWithChildren<BasicContainerProps>> = (
  props
) => {
  return (
    <div className={"mx-auto mb-5 max-w-[820px] px-2 md:px-3 lg:max-w-[992px]"}>
      {props.children}
    </div>
  );
};

export default BasicContainer;
