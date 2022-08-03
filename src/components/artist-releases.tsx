import * as React from "react";
import type {
  SubsonicArtistResponse,
  SubsonicAlbum,
  SubsonicArtist,
} from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST } from "../const";
import { albumCondition, epCondition, singleCondition } from "../util";

import ArtistSection from "../components/artist-section";
import Album from "../components/album";

const RawArtistReleases: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );

  return (
    <ArtistSection header={"Releases"}>
      <div className="flex flex-row flex-wrap">
        {artist?.album.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </ArtistSection>
  );
};

export const ArtistReleasesSkeleton: React.FC = () => {
  return null;
};

const ArtistReleases: React.FC<{
  id: string;
}> = ({ id }) => (
  <React.Suspense fallback={<ArtistReleasesSkeleton />}>
    <RawArtistReleases id={id} />
  </React.Suspense>
);

export default ArtistReleases;
