import React from "react";
import DateView from "@components/basic/date-view";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { getTag } from "@lib/tags";
import type { InstagramContent, InstagramPost } from "@lib/instagram";
import { parseISO } from "date-fns";
import Script from "next/script";
import InstagramTagLink, { ITag } from "./instagram-tag-link";
import InstagramCaption from "./instagram-caption";
import InstagramMediaViewer from "./instagram-media-viewer";
import {
  createFacebookOGGraphImage,
  createTwitterGraphImage,
} from "@lib/image-service";
import BasicContainer from "@components/basic/basic-container";
import ShareButton from "@components/basic/share-button";
import Modal from "@components/modal";
import { Dialog } from "@headlessui/react";
import STLogo from "@components/st-logo";
import { addUtmParamsToUrl, UtmProps } from "@lib/uri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faTags } from "@fortawesome/pro-duotone-svg-icons";
type Props = Omit<InstagramContent, "fullPath"> & {
  post: InstagramPost | null;
  children: React.ReactNode;
};
export default function InstagramLayout(props: Props) {
  const { title, date, slug, post, tags } = props;
  const hasTags = tags && tags.length > 0;
  const keywords = hasTags && tags.map ? tags.map((it) => getTag(it).name) : [];

  let description = (post?.caption || "").substring(0, 159);

  if (description.length === 160) {
    description = description.substring(0, 156) + "...";
  }

  const primaryId = post?.primaryMedia?.id;

  return (
    <Layout>
      <BasicMeta
        url={`/instagram/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/instagram/${slug}`}
        title={title}
        description={description}
        imageUrl={primaryId && createTwitterGraphImage(post?.primaryMedia?.id)}
      />
      <OpenGraphMeta
        url={`/instagram/${slug}`}
        title={title}
        description={description}
        image={primaryId && createFacebookOGGraphImage(primaryId)}
      />
      <JsonLdMeta
        url={`/instagram/${slug}`}
        title={title}
        keywords={keywords}
        date={parseISO(date)}
        author={"@StoneAwesomeHQ"}
        description={description}
        image={post?.primaryMedia?.url}
      />
      <InstagramBody {...props} />
    </Layout>
  );
}

export const InstagramBody: React.FC<Props> = ({
  title,
  date,
  children,
  tags,
  material,
  post,
}) => {
  const [isOpen, set_isOpen] = React.useState<boolean>(false);
  const utmParams: Partial<UtmProps> = {
    utm_source: "stone_awesome",
    utm_medium: "referral",
    utm_id: post.id,
  };
  const hasLinks = post.links && post.links.length > 0;
  const allTags: ITag[] = [
    ...(material || []).map((m) => ({ tag: m, type: "material" } as ITag)),
    ...(tags || []).map((t) => ({ tag: t, type: "tag" } as ITag)),
  ];
  const hasTags = allTags.length > 0;

  return (
    <BasicContainer>
      <div className={`flex flex-col gap-3`}>
        <div
          className={
            "flex flex-col gap-1 divide-y rounded-b border-b border-l border-r bg-_bsLight px-3 pt-2 pb-1"
          }
        >
          <header className="flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={
                    "flex items-center justify-between text-2xl font-bold"
                  }
                >
                  {title}
                </h1>
                <a href={post.permalink}>
                  <DateView date={parseISO(date)} />
                </a>
              </div>
              <div className="flex flex-col items-center">
                <ShareButton
                  title={`${title} - StoneAwesome`}
                  className={"px-2 text-lg font-normal"}
                />
              </div>
            </div>
          </header>
          {hasTags && (
            <div className={"flex items-center gap-2 pt-1"}>
              <FontAwesomeIcon icon={faTags} fixedWidth />
              <div className={"flex gap-3 overflow-auto pb-1 md:flex-wrap"}>
                {allTags.map((tag) => (
                  <InstagramTagLink
                    tag={tag}
                    key={JSON.stringify(tag)}
                    className={
                      "rounded px-2 font-medium text-_bsPrimary/80 underline decoration-_bsInfo/80 underline-offset-1 transition-all hover:bg-_bsInfo/20 hover:text-_bsPrimary/90 hover:decoration-_bsPrimary active:text-_bsPrimary active:decoration-_bsInfo"
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {hasLinks ? (
          <>
            <div className="flex flex-col justify-between sm:flex-row">
              <button
                className="flex items-center justify-center gap-2 rounded bg-_bsPrimary px-5 py-1 text-white sm:py-2"
                onClick={() => set_isOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={faShop} />
                {"Shop This Look"}
              </button>
              {/* <button
                className=" mt-3 flex items-center justify-center gap-2 rounded bg-_bsInfo px-5 py-1 text-white  sm:py-2"
                onClick={() => set_isOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={faSearch} />
                {"Get Design Help"}
              </button> */}
            </div>
            <Modal onCloseClick={() => set_isOpen(false)} isOpen={isOpen}>
              <div className="bg-white px-2 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="flex items-center gap-1 text-xl font-medium leading-6 text-gray-900"
                    >
                      <FontAwesomeIcon icon={faShop} />

                      {"Shop this Look!"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {
                          "Below you'll find links to different marketplaces that may carry this material."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 border-t bg-gray-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:gap-3 sm:px-6">
                {post.links?.map((l, i) =>
                  l.isSt ? (
                    <a
                      key={i}
                      href={addUtmParamsToUrl(l.url, utmParams)}
                      target={"_blank"}
                    >
                      <STLogo
                        orientation="text"
                        className="inline-flex w-full justify-center px-4 py-2 sm:ml-3 sm:w-auto sm:text-sm"
                      />
                    </a>
                  ) : (
                    <a
                      key={i}
                      href={addUtmParamsToUrl(l.url, utmParams)}
                      target={"_blank"}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-_bsPrimary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {l.title}
                    </a>
                  )
                )}
              </div>
            </Modal>
          </>
        ) : null}

        {children && <div>{children}</div>}
        {post && (
          <div className={`flex flex-col gap-3 md:grid md:grid-cols-12`}>
            <div className={`md:col-span-5`}>
              <InstagramMediaViewer post={post} />
            </div>
            {post.caption && (
              <article className={`border-t md:col-span-7 md:border-t-0`}>
                <div className={`prose md:prose-lg`}>
                  <InstagramCaption caption={post.caption} />
                </div>
              </article>
            )}
          </div>
        )}
      </div>
    </BasicContainer>
  );
};
