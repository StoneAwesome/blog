import * as React from "react";
import { Dialog, Combobox, Transition } from "@headlessui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-duotone-svg-icons";
import { useRouter } from "next/router";
import { LINK_SPECIAL_CLASS } from "@components/nav-header";
import tags from "@meta/tags.yml";
import { TagContent } from "@lib/tags";

export type SearchProps = {};

function filterArray(array: TagContent[] | undefined, query: string) {
  return array?.filter((v) => v.slug.indexOf(query) > -1) || [];
}

const Search: React.FC<SearchProps> = (props) => {
  const [query, set_query] = React.useState("");
  const [isOpen, set_isOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const filtered = React.useMemo(() => {
    return {
      colors: filterArray(tags.colors, query),
      materials: filterArray(tags.materials, query),
      tags: filterArray(tags.tags, query),
    };
  }, [query]);

  return (
    <>
      <button
        onClick={() => set_isOpen(!isOpen)}
        className={`${LINK_SPECIAL_CLASS} flex items-center gap-2`}
      >
        <FontAwesomeIcon icon={faSearch} />
        {"Search"}
      </button>
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog
          onClose={set_isOpen}
          className={"fixed inset-0 overflow-y-auto p-4 lg:pt-[25vh]"}
        >
          <Transition.Child
            as={React.Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave={"duration-200 ease-in"}
            leaveFrom={"opacity-100"}
            leaveTo={"opacity-0"}
          >
            <Dialog.Overlay
              className={"fixed inset-0 bg-_bsDark/80 backdrop-blur-sm"}
            />
          </Transition.Child>

          <Transition.Child
            enter="duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave={"duration-200 ease-in"}
            leaveFrom={"opacity-100 scale-100"}
            leaveTo={"opacity-0 scale-95"}
          >
            <Combobox
              as={"div"}
              value={query}
              onChange={(v: any) => {
                set_isOpen(false);
                set_query("");
                router.push(`/instagram/tags/${v.slug}`);
              }}
              className="relative mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden  rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
            >
              <div className="flex items-center px-4">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={"h-6 w-6 text-gray-500"}
                />
                <Combobox.Input
                  onChange={(evt) => {
                    set_query(evt.target.value?.toLowerCase() || "");
                  }}
                  className={
                    "placeholder:gray-400 h-12 w-full border-0 bg-transparent text-sm text-gray-800 outline-none ring-0"
                  }
                  placeholder={"Search ..."}
                />
              </div>
              <Combobox.Options className={"max-h-96 overflow-auto px-2"}>
                <RenderItems items={filtered.colors} />
                <RenderItems items={filtered.materials} />
                <RenderItems items={filtered.tags} />

                {query &&
                filtered.colors.length === 0 &&
                filtered.materials.length === 0 &&
                filtered.tags.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">{"No results"}</p>
                ) : null}
              </Combobox.Options>
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const RenderItems: React.FC<{ items: TagContent[] }> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <>
      {items.map((x) => (
        <Combobox.Option key={x.slug} value={x}>
          {({ active }) => (
            <div
              className={`my-2 flex items-center gap-2 space-x-1 rounded px-4 py-2 transition-all duration-75 ${
                active ? "bg-_bsInfo font-semibold text-white" : "bg-white"
              }`}
            >
              <span>{x.name}</span>
            </div>
          )}
        </Combobox.Option>
      ))}
    </>
  );
};

export default Search;
