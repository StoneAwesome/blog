import React, { useEffect } from "react";

export function useClientOnly<T>(grabClientOnlyValue: () => T) {
  const [setup, set_setup] = React.useState<{ readyToRender: boolean; value: T | null }>({
    readyToRender: false,
    value: null,
  });

  useEffect(() => {
    set_setup({ readyToRender: true, value: grabClientOnlyValue() });
  }, []);

  return setup;
}
