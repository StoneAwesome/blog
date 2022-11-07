import React, { ReactText } from "react";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import StoryBlokMaterialClient, {
  IStoryBlokMaterialContent,
} from "@lib/storyblok/storyblok-material-client";
import type { IStoryBlockStory } from "@lib/storyblok/storyblok-client-base";
import BasicContainer from "@components/basic/basic-container";
import { StoryBlokImg } from "@components/storyblok/storyblok-image";
import Link from "next/link";

interface MaterialPageProps {
  material: IStoryBlockStory<IStoryBlokMaterialContent>[];
}

export default function MaterialPage(
  props: //   posts,
  //   tags,
  //   pagination,
  InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <Layout>
      <BasicMeta
        url={"/"}
        title={"Stone Library"}
        description={"A world of stone"}
      />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <BasicContainer noMB>
        <div className="prose max-w-none">
          <h1>{"The Stone Library"}</h1>
          <p>
            {
              "Below you'll find a vast collection of stone, both natural and made made. Our goal with this library is to provide a comprehensive database of the most common materials used both in and around the home. It is by no means exhaustive, but it's a great start. If you don't see your material located there, or want to add your specific branded names please let us know."
            }
          </p>
          <div className="not-prose grid grid-cols-3">
            {props.material.map((m) => (
              <MaterialArticle
                key={m.uuid}
                material={m.content}
                slug={m.slug}
              />
            ))}
          </div>
        </div>
      </BasicContainer>
    </Layout>
  );
}

const MaterialArticle: React.FC<{
  material: IStoryBlokMaterialContent;
  slug: string;
}> = ({ material: m, slug }) => {
  const img = m.images?.[0];
  return (
    <div className="group relative flex flex-col rounded-xl border px-3 pt-1 pb-3">
      <Link
        href={`/material/${slug}`}
        className="leading-2 text-center text-xl font-semibold after:absolute after:inset-0"
      >
        {m.name}
      </Link>
      {img ? (
        <StoryBlokImg
          img={img}
          className={
            "h-auto rounded transition-all ease-in-out group-hover:scale-105"
          }
        />
      ) : null}
    </div>
  );
};

export const getStaticProps: GetStaticProps<MaterialPageProps> = async (
  ctx
) => {
  const material = await StoryBlokMaterialClient.grabMaterialStories();
  return {
    props: {
      material: material,
    },
  };
};
