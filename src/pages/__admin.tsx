import Script from "next/script";
import * as React from "react";
import Article from "@components/admin/previews/post-preview";
import InstagramSelector, {
  INSTAGRAM_POST_SELECTED_EVENT,
} from "@components/admin/instagram-selector";
import type { CmsWidgetControlProps } from "netlify-cms-core";
import InstagramPreview from "@components/admin/previews/instagram-preview";
import { InstagramPost } from "@lib/instagram";
export type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = (props) => {
  React.useEffect(() => {
    (async () => {
      const CMS = (await import("netlify-cms-app")).default;
      CMS.init();
      const allCss = document.head.getElementsByTagName("style");
      for (let i = 0; i < allCss.length; i++) {
        const s = allCss[i];

        if (s.innerText) {
          CMS.registerPreviewStyle(s.innerText, { raw: true });
        }
      }

      const allLinks = document.head.getElementsByTagName("link");
      for (let i = 0; i < allLinks.length; i++) {
        const l = allLinks[i];
        if (l.getAttribute("as") === "style") {
          CMS.registerPreviewStyle(l.href);
        } else if (l.getAttribute("rel") === "stylesheet") {
          CMS.registerPreviewStyle(l.href);
        }
      }

      CMS.registerPreviewTemplate("posts", Article);
      CMS.registerPreviewTemplate("instagram", InstagramPreview);
      CMS.registerWidget("instagram", InstagramSelector);
      CMS.registerWidget("instagram_id", InstagramIdWidget);
    })();
  }, []);

  return (
    <div>
      <Script src={"https://identity.netlify.com/v1/netlify-identity-widget.js"} />
    </div>
  );
};

const InstagramIdWidget: React.FC<CmsWidgetControlProps<string>> = (props) => {
  //-- This is a little bit of a dirty way to 'connect / listen' to changes when the
  React.useEffect(() => {
    const listener = (e: CustomEvent<InstagramPost>) => {
      props.onChange(e.detail?.id || "");
    };

    document.addEventListener(INSTAGRAM_POST_SELECTED_EVENT, listener as any);

    return () => document.removeEventListener(INSTAGRAM_POST_SELECTED_EVENT, listener as any);
  });

  return <span className="bg-_bsPrimary text-white rounded px-2 ">{props.value}</span>;
};

export default AdminPage;
