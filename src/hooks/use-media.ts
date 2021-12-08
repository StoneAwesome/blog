import { useEffect, useState } from "react";

//function tryGetValue(mediaQueryLists/)

export function useMedia<T>(
  queries: string[],
  values: T[],
  defaultValue: T,
  onMediaChanged: ((val: T) => void) | null = null
) {
  // State and setter for matched value
  const [value, setValue] = useState(defaultValue);

  useEffect(
    () => {
      // Array containing a media query list for each query
      const mediaQueryList = CreateMediaQueryList(queries);

      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook callback is created once on mount).
      const handler = () => {
        const val = GetValueFromMediaQueryList<T>(mediaQueryList, values, defaultValue);

        if (onMediaChanged != null) {
          onMediaChanged(val);
        }

        setValue(val);
      };
      // Set a listener for each media query with above handler as callback.
      mediaQueryList.forEach((mql) => mql?.addEventListener?.("change", handler));

      setValue(GetValueFromMediaQueryList<T>(mediaQueryList, values, defaultValue));
      // Remove listeners on cleanup
      return () => mediaQueryList.forEach((mql) => mql?.removeEventListener?.("change", handler));
    },
    [] // Empty array ensures effect is only run on mount
  );

  return value;
}

function CreateMediaQueryList(queries: string[]): MediaQueryList[] {
  if (process.browser) {
    return queries.map((q) => window.matchMedia(q));
  }
  return [];
}

function GetValueFromMediaQueryList<T>(
  mediaQueryLists: MediaQueryList[],
  values: T[],
  defaultValue: T
) {
  // Get index of first media query that matches
  const index = mediaQueryLists.findIndex((mql) => mql.matches);
  // Return related value or defaultValue if none
  return typeof values[index] !== "undefined" ? values[index] : defaultValue;
}

const bsqDown = {
  sm: "(max-width: 576px)",
  md: "(max-width: 768px)",
  lg: "(max-width: 992px)",
  xl: "(max-width: 1200px)",
  xxl: "(max-width: 1500px)",
};

const bsqUp = {
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1500px)",
};

/**
 *
 * @param breaks These should be in order of smallest to largest
 * @param values
 * @param defaultValue
 * @returns
 */
export function useBootstrapBreaksDown<T>(
  breaks: (keyof typeof bsqDown)[],
  values: T[],
  defaultValue: T
) {
  const queries = breaks.map((q) => bsqDown[q]);
  return useMedia(queries, values, defaultValue);
}
/**
 *
 * @param breaks These should be in order of largest to smallest
 * @param values
 * @param defaultValue
 * @returns
 */
export function useBootstrapBreaksUp<T>(
  breaks: (keyof typeof bsqUp)[],
  values: T[],
  defaultValue: T
) {
  const queries = breaks.map((q) => bsqUp[q]);
  return useMedia(queries, values, defaultValue);
}

export function useIsMobile() {
  return useMedia([bsqDown.sm], [true], false);
}

export function useIsLessThenMD() {
  return useMedia([bsqDown.md], [true], false);
}

export function useIsLessThenLG() {
  return useMedia([bsqDown.lg], [true], false);
}

export function useIsLessThenXL() {
  return useMedia([bsqDown.xl], [true], false);
}

export function useIsLessThenXXL() {
  return useMedia([bsqDown.xxl], [true], false);
}
