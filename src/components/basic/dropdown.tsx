import * as React from "react";
import classNames from "classnames";
import Link from "next/link";
export type DropDownDataProps = {
  items: DropDownItem[];
  btnContent: React.ReactNode;
  btnClassName?: string;
  menuRightAlign?: boolean;
  hideToggle?: boolean;
};
export type DropDownActionProps = {};

export type DropDownProps = DropDownDataProps & DropDownActionProps;

export enum DropdownItemType {
  Divider,
  Header,
  Item,
  Link,
}
type DropdownDivider = {
  type: DropdownItemType.Divider;
};

type DropdownHeader = {
  type: DropdownItemType.Header;
  text: React.ReactNode;
};

type DropdownItem = {
  type?: DropdownItemType.Item;
  onClick: () => void;
  className?: string;
  node: React.ReactNode;
};

type DropDownLink = {
  type: DropdownItemType.Link;
  href: string;
  node: React.ReactNode;
  linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
};

export type DropDownItem = DropdownDivider | DropdownHeader | DropdownItem | DropDownLink;
export const DROPDOWN_DIVIDER: DropdownDivider = {
  type: DropdownItemType.Divider,
};

const DropDown: React.FC<DropDownProps> = (props) => {
  const { items } = props;

  return <>
    <button
      className={classNames(props.btnClassName, {
        "btn btn-dark": !props.btnClassName,
        "dropdown-toggle": !props.hideToggle,
      })}
      type="button"
      data-bs-toggle="dropdown"
      data-bs-auto-close="true"
      aria-haspopup="true"
      aria-expanded="false"
    >
      {props.btnContent}
    </button>
    <div
      className={classNames("dropdown-menu", {
        "dropdown-menu-end": props.menuRightAlign,
      })}
    >
      {items
        .filter((x) => x)
        .map((x, idx) => {
          if (x.type === DropdownItemType.Divider) {
            return <div className={"dropdown-divider"} key={idx}></div>;
          } else if (x.type == DropdownItemType.Header) {
            return (
              <b className={"dropdown-header"} key={idx}>
                {x.text}
              </b>
            );
          } else if (x.type === DropdownItemType.Link) {
            return (
              (<Link
                href={x.href}
                key={idx}
                {...x.linkProps}
                className={`dropdown-item ${x.linkProps?.className || ""}`}>

                {x.node}

              </Link>)
            );
          }

          return (
            <button key={idx} className={`dropdown-item ${x.className}`} onClick={x.onClick}>
              {x.node}
            </button>
          );
        })}
    </div>
  </>;
};

export default DropDown;
