import React from "react";

type COLUMN_WIDTH = 1 | 2 | 3 | 4 | 5 | 6;
interface MasonryColumnOptions {
  columns: COLUMN_WIDTH;
}

interface MasonryDetails {
  parentClass: string;
  getChildClass: (idx: number) => string;
}

export function useMasonryLayout<T>(items: T[], options: MasonryColumnOptions): MasonryDetails {
  const result = React.useMemo<MasonryDetails>(() => {
    const len = items?.length || 0;

    if (len === 0) {
      return { parentClass: "", getChildClass: () => "" };
    }

    const colWidth = len >= options.columns ? options.columns : (len as COLUMN_WIDTH);
    //-- Determine maxGridCols based on number of items.
    const gridCols: string = getGridCols(colWidth);

    return {
      parentClass: `grid ${gridCols}`,
      getChildClass(idx) {
        if (isBig(idx, colWidth, len)) {
          return colWidth > 2 ? "col-span-2 row-span-2" : "col-span-2";
        }
        return "";
      },
    };
  }, [items, options]);

  return result;
}
function getGridCols(arg0: COLUMN_WIDTH): string {
  switch (arg0) {
    case 6:
      return "grid-cols-6";
    case 5:
      return "grid-cols-5";
    case 4:
      return "grid-cols-4";
    case 3:
      return "grid-cols-3";
    case 2:
      return "grid-cols-2";
    case 1:
    default:
      return "grid-cols-1";
  }
}

function isBig(idx: number, cols: COLUMN_WIDTH, len: number) {
  if (cols === 5) {
    //-- With 5 cols, we have 7 elements per, and we have 3 different variants
    const rowVariant = idx % 21;
    return rowVariant < 7
      ? idx % 7 === 0
      : rowVariant < 14
      ? idx % 7 === 1
      : rowVariant < 21
      ? idx % 7 === 2
      : idx % 7 === 3;
  }

  if (cols === 4) {
    //-- With 4 cols, we have 5 elements per, and we have 3 different variants
    const rowVariant = idx % 15;
    return rowVariant < 5 ? idx % 5 === 0 : rowVariant < 10 ? idx % 5 === 1 : idx % 5 === 2;
  }

  if (cols === 3) {
    //-- With 3 cols, we have 3 elements per and we have 2 variants
    const rowVariant = idx % 6;
    return rowVariant < 3 ? idx % 3 === 0 : rowVariant % 3 === 1;
  }
  if (cols === 2) {
    //-- With 2 cols, we have either 2 or 1 elements per row and we have 2 variants
    return idx % 3 === 0 || len < 3 || (idx === len - 1 && len % 2 == 1);
  }

  if (idx % cols === 0) return true;

  //idx % colWidth === 0 || len < colWidth || (idx === len - 1 && len % 2 == 1)
  return false;
}
