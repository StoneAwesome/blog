import * as React from "react";

export function useCollapsePanel(isCollapsedInitially: boolean = false) {
  const [isCollapsed, setIsCollapsed] = React.useState(isCollapsedInitially);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const cb = React.useCallback(() => {
    if (!panelRef.current) return;

    const p = panelRef.current;

    if (!p) return;

    if (isCollapsed) {
      p.classList.add("show");
      p.classList.remove("hide");
    } else {
      p.classList.add("hide");
      p.classList.remove("show");
    }

    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, panelRef.current]);

  React.useEffect(() => {
    if (panelRef.current) {
      const p = panelRef.current;
      if (!p) return;

      if (!isCollapsedInitially) {
        p.classList.add("show");
        p.classList.remove("hide");
      }
    }
  }, []);

  return {
    panelRef,
    onClick: cb,
    isCollapsed,
  };
}
