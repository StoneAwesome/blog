import { faShop } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { InstagramPost } from "@lib/instagram";
import { addUtmParamsToUrl, UtmProps } from "@lib/uri";
import * as React from "react";
import Modal from "./modal";
import STLogo from "./st-logo";

export type ShopThisLookButtonProps = {
  links: Required<InstagramPost>["links"];
  utmProps?: Partial<UtmProps>;
};

const ShopThisLookButton: React.FC<ShopThisLookButtonProps> = (props) => {
  const [isOpen, set_isOpen] = React.useState<boolean>(false);
  const utmParams: Partial<UtmProps> = {
    ...(props.utmProps || {}),
    utm_source: "stone_awesome",
    utm_medium: "referral",
  };
  return (
    <>
      <button
        className="flex items-center justify-center gap-2 rounded bg-_bsPrimary px-5 py-1 text-white sm:py-2"
        onClick={() => set_isOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faShop} />
        {"Shop This Look"}
      </button>
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
          {props.links?.map((l, i) =>
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
  );
};

export default ShopThisLookButton;
