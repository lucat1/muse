import * as React from "react";
import { useAtom } from "jotai";
import type { SubsonicArtistInfoResponse, SubsonicArtist } from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST, GET_ARTIST_INFO } from "../const";
import { titleAtom } from "../stores/title";

import Image, { ImageSkeleton } from "../components/img";

const SECITON_CLASSES = "py-4 pt-8 flex flex-row items-end";
const IMAGE_CLASSES = "w-32 md:w-48 lg:w-64 aspect-square rounded-lg";
const HEADING_CLASSES = "mx-8 text-2xl md:text-3xl xl:text-4xl font-extrabold";
const ARTICLE_CLASSES =
  "w-full prose prose-neutral dark:prose-invert prose-sm xl:prose-base max-w-none text-justify font-serif";

const RawArtistInfo: React.FC<{ id: string }> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtist>(
    `${GET_ARTIST}?id=${id}`
  );
  const [_, setTitle] = useAtom(titleAtom);
  React.useEffect(() => {
    setTitle(artist?.name || "Unkown artist");
  }, [artist]);
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${artist?.id}`
  );
  return (
    <>
      <section className={SECITON_CLASSES}>
        <Image
          className={IMAGE_CLASSES}
          src={
            artistInfo?.largeImageUrl ||
            artistInfo?.mediumImageUrl ||
            artist?.artistImageUrl ||
            artistInfo?.smallImageUrl
          }
        />
        <h1 className={HEADING_CLASSES}>{artist?.name}</h1>
      </section>
      <article
        className={ARTICLE_CLASSES}
        dangerouslySetInnerHTML={{
          __html: artistInfo?.biography as string,
        }}
      />
    </>
  );
};

export const ArtistInfoSkeleton: React.FC = () => {
  return (
    <>
      <section className={SECITON_CLASSES}>
        <ImageSkeleton className={IMAGE_CLASSES} />
        <h1 className={HEADING_CLASSES}>
          <div className="w-48 h-6 lg:w-64 xl:w-96 xl:h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        </h1>
      </section>
      <article
        className={`w-full h-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 ${ARTICLE_CLASSES}`}
      />
    </>
  );
};

const ArtistInfo: React.FC<{ id: string }> = ({ id }) => {
  return (
    <React.Suspense fallback={<ArtistInfoSkeleton />}>
      <RawArtistInfo id={id} />
    </React.Suspense>
  );
};

export default ArtistInfo;
