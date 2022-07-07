import { faArrowUpFromBracket, faShare } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientOnly } from "@hooks/use-client-only";
import * as React from "react";

export type ShareButtonProps = {
  /**
   * Optional text to be displayed when the native mobile share charm is invoked.
   */
  text?: string;
  title: string;
  url: string;
  className?: string;
};

function canUseShareCharm() {
  return typeof navigator !== "undefined" && (navigator as any).share;
}

const ShareButton: React.FC<React.PropsWithChildren<ShareButtonProps>> = (props) => {
  const setup = useClientOnly(canUseShareCharm);

  if (!setup.readyToRender) return null;

  if (setup.value) {
    return (
      <button
        className={`text-_bsPrimary hover:text-_bsPrimary/90 flex flex-col items-center ${props.className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigator.share({
            url: props.url,
            title: props.title,
            text: props.text,
          });
        }}
      >
        <FontAwesomeIcon icon={faArrowUpFromBracket} />
      </button>
    );
  }

  return null;
};

export default ShareButton;
