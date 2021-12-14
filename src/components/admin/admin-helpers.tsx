import * as React from "react";
import type { PreviewTemplateComponentProps } from "netlify-cms-core";
import { remark } from "remark";
import html from "remark-html";

export function safeGet<TProps>(entry: PreviewTemplateComponentProps["entry"]) {
  return <TKey extends keyof TProps>(key: TKey, emptyValue: TProps[TKey]) => {
    if (!entry) return emptyValue;

    const js = entry.toJS() as any as { data: TProps };

    const value = js.data[key];

    return value || emptyValue;
  };
}

export function useRemark(entry: PreviewTemplateComponentProps["entry"]) {
  const [data, set_data] = React.useState<string | null>(null);
  const htmlString = entry.getIn(["data", "body"]) as string;

  console.log(`Html String: (${htmlString})`);

  React.useEffect(() => {
    if (htmlString && htmlString?.trim().length > 0) {
      remark()
        .use(html, { allowDangerousHtml: true, allowParseErrors: true })
        .process(htmlString)
        .then((result) => {
          set_data(
            result.toString().replaceAll(/<img ()src/gi, `<img class="img-fluid rounded " src$1`)
          );
        });
    }
  }, [htmlString]);

  return data ? <div dangerouslySetInnerHTML={{ __html: data || "" }}></div> : null;
}
