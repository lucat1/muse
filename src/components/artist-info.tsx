import * as React from "react";
import type { SubsonicArtistInfoResponse, SubsonicArtist } from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST_INFO } from "../const";

import Image, { ImageSkeleton } from "../components/img";

const RawArtistInfo: React.FC<{ artist: SubsonicArtist }> = ({ artist }) => {
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${artist.id}`
  );
  return (
    <>
      <section className="py-4 pt-8 flex flex-row items-end">
        <Image
          className="w-32 md:w-48 lg:w-64 aspect-square rounded-lg"
          src={artistInfo?.mediumImageUrl}
        />
        <h1 className="mx-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
          {artist.name}
        </h1>
      </section>
      <article
        className="w-full prose prose-sm xl:prose-base max-w-none text-justify font-serif"
        dangerouslySetInnerHTML={{
          __html: artistInfo?.biography as string,
        }}
      />
    </>
  );
};

export const ArtistInfoSkeleton: React.FC<{ artist: SubsonicArtist }> = ({
  artist,
}) => {
  return (
    <>
      <section className="py-4 pt-8 flex flex-row items-end">
        <ImageSkeleton />
        <h1 className="mx-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
          {artist.name}
        </h1>
      </section>
      <article className="w-full max-w-none text-justify font-serif bg-neutral-200 dark:bg-neutral-700" />
    </>
  );
};

const ArtistInfo: React.FC<{ artist: SubsonicArtist }> = ({ artist }) => (
  <React.Suspense fallback={<ArtistInfoSkeleton artist={artist} />}>
    <RawArtistInfo artist={artist} />
  </React.Suspense>
);

export default ArtistInfo;
