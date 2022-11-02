declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  export default ReactComponent;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.yml" {
  const value: any;
  export default value;
}

type StringKey<T> = Extract<keyof T, string>;
type IDictionary<T> = Record<string, T>;
type TypeSafeOmit<T, K extends keyof T> = Omit<T, K>;
type JustParticularKeys<T, TType> = {
  [P in keyof T]: T[P] extends TType ? P : never;
}[keyof T];
