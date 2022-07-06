import * as React from "react";

export type BasicContainerProps = {};

const BasicContainer: React.FC<React.PropsWithChildren<BasicContainerProps>> = (props) => {
  return (
    <div className={"px-2 md:px-3 mx-auto mb-5 max-w-[760px] lg:max-w-[992px]"}>
      {props.children}
    </div>
  );
};

export default BasicContainer;
